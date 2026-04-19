#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol};

#[contracttype]
#[derive(Clone)]
pub struct EscrowRecord {
    pub ngo: Address,
    pub beneficiary: Address,
    pub amount: i128,
    pub program_id: Symbol,
    pub oracle_contract: Address,
    pub expiry: u64,
    pub released: bool,
}

#[contracttype]
pub enum DataKey {
    NGO,
    OracleContract,
    Escrow(Address, Symbol), // (beneficiary, program_id)
}

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    // TODO: Implement initialize(env, ngo, oracle_contract)
    // TODO: Implement lock_funds(env, ngo, beneficiary, amount, program_id, expiry)
    //   - Requires ngo auth
    //   - Transfer token from ngo to contract
    //   - Store EscrowRecord
    // TODO: Implement release_funds(env, beneficiary, program_id) -> i128
    //   - Call oracle.is_condition_met(beneficiary, program_id)
    //   - If true, transfer amount to beneficiary
    //   - Mark record as released
    // TODO: Implement reclaim(env, ngo, program_id)
    //   - Only callable after expiry
    //   - Transfer unclaimed funds back to ngo
}

#[cfg(test)]
mod test {
    // TODO: test_lock_and_release
    // TODO: test_reclaim_after_expiry
    // TODO: test_release_without_condition_panics
}
