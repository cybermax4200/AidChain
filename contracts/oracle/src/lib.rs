#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, BytesN, Env, Symbol, Vec};

#[contracttype]
#[derive(Clone)]
pub struct ConditionRecord {
    pub beneficiary: Address,
    pub program_id: Symbol,
    pub condition_type: Symbol,
    pub evidence_hash: BytesN<32>,
    pub verified_at: u64,
    pub verifier: Address,
}

#[contracttype]
pub enum DataKey {
    Admin,
    Verifiers,
    Condition(Address, Symbol),
}

#[contract]
pub struct OracleContract;

#[contractimpl]
impl OracleContract {
    /// Initialize the contract with admin and authorized verifiers
    pub fn initialize(env: Env, admin: Address, verifiers: Vec<Address>) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Verifiers, &verifiers);
    }

    /// Record a condition as fulfilled for a beneficiary
    pub fn fulfill_condition(
        env: Env,
        verifier: Address,
        beneficiary: Address,
        program_id: Symbol,
        condition_type: Symbol,
        evidence_hash: BytesN<32>,
    ) -> bool {
        verifier.require_auth();

        let verifiers: Vec<Address> = env
            .storage()
            .instance()
            .get(&DataKey::Verifiers)
            .unwrap_or(Vec::new(&env));

        let mut is_authorized = false;
        for v in verifiers.iter() {
            if v == verifier {
                is_authorized = true;
                break;
            }
        }
        if !is_authorized {
            panic!("Unauthorized verifier");
        }

        let record = ConditionRecord {
            beneficiary: beneficiary.clone(),
            program_id: program_id.clone(),
            condition_type,
            evidence_hash,
            verified_at: env.ledger().timestamp(),
            verifier,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Condition(beneficiary, program_id), &record);

        true
    }

    /// Check if a beneficiary's condition is met
    pub fn is_condition_met(env: Env, beneficiary: Address, program_id: Symbol) -> bool {
        env.storage()
            .persistent()
            .has(&DataKey::Condition(beneficiary, program_id))
    }

    // TODO: add_verifier(env, admin, new_verifier)
    // TODO: remove_verifier(env, admin, verifier)
    // TODO: get_condition_record(env, beneficiary, program_id) -> ConditionRecord
    // TODO: transfer_admin(env, admin, new_admin)
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, vec, Address, Env};

    #[test]
    fn test_initialize_and_fulfill() {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, OracleContract);
        let client = OracleContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let verifier = Address::generate(&env);
        let beneficiary = Address::generate(&env);

        client.initialize(&admin, &vec![&env, verifier.clone()]);

        let program_id = Symbol::new(&env, "PROG1");
        let condition_type = Symbol::new(&env, "SCHOOL");
        let evidence_hash = BytesN::from_array(&env, &[0u8; 32]);

        assert!(!client.is_condition_met(&beneficiary, &program_id));

        client.fulfill_condition(
            &verifier,
            &beneficiary,
            &program_id,
            &condition_type,
            &evidence_hash,
        );

        assert!(client.is_condition_met(&beneficiary, &program_id));
    }

    // TODO: test_unauthorized_verifier_panics
    // TODO: test_double_initialize_panics
}

// NOTE: Future improvement — emit Soroban events on condition fulfillment
// env.events().publish((Symbol::new(&env, "condition_fulfilled"),), (beneficiary, program_id));
