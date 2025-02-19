#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("F5HCKquEqLo7wirBB9NNfwFqMC7Rc6yhmRJnVRN7mWKm");

#[program]
pub mod friggydapp {
    use super::*;

  pub fn close(_ctx: Context<CloseFriggydapp>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.friggydapp.count = ctx.accounts.friggydapp.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.friggydapp.count = ctx.accounts.friggydapp.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeFriggydapp>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.friggydapp.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeFriggydapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Friggydapp::INIT_SPACE,
  payer = payer
  )]
  pub friggydapp: Account<'info, Friggydapp>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseFriggydapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub friggydapp: Account<'info, Friggydapp>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub friggydapp: Account<'info, Friggydapp>,
}

#[account]
#[derive(InitSpace)]
pub struct Friggydapp {
  count: u8,
}
