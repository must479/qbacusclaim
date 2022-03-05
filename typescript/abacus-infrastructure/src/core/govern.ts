import { expect } from 'chai';
import { AbacusContext } from '@abacus-network/sdk';
import { CoreDeploy } from './CoreDeploy';
import {
  ValidatorViolation,
  UpgradeBeaconViolation,
  Violation,
  ViolationType,
} from '../checks';
import { Call, CallBatch } from '@abacus-network/sdk/dist/abacus/govern';

interface DomainedCall {
  domain: number;
  call: Call;
}

export class GovernanceCallBatchBuilder {
  private _deploy: CoreDeploy;
  private _context: AbacusContext;
  private _violations: Violation[];

  constructor(
    deploy: CoreDeploy,
    context: AbacusContext,
    violations: Violation[],
  ) {
    this._deploy = deploy;
    this._context = context;
    this._violations = violations;
  }

  async build(): Promise<CallBatch> {
    const governorCore = await this._context.governorCore();
    const batch = await governorCore.newGovernanceBatch();
    const txs = await Promise.all(
      this._violations.map((v) => this.handleViolation(v)),
    );
    txs.map((call) => batch.push(call.domain, call.call));
    return batch;
  }

  handleViolation(v: Violation): Promise<DomainedCall> {
    switch (v.type) {
      case ViolationType.UpgradeBeacon:
        return this.handleUpgradeBeaconViolation(v);
      case ViolationType.Validator:
        return this.handleValidatorViolation(v);
      default:
        throw new Error(`No handler for violation type ${v.type}`);
        break;
    }
  }

  async handleUpgradeBeaconViolation(
    violation: UpgradeBeaconViolation,
  ): Promise<DomainedCall> {
    const domain = violation.domain;
    const ubc = this._deploy.upgradeBeaconController(domain);
    if (ubc === undefined) throw new Error('Undefined ubc');
    const tx = await ubc.populateTransaction.upgrade(
      violation.beaconProxy.beacon.address,
      violation.expected,
    );
    if (tx.to === undefined) throw new Error('undefined tx.to');
    return { domain, call: tx as Call };
  }

  async handleValidatorViolation(
    violation: ValidatorViolation,
  ): Promise<DomainedCall> {
    const domain = violation.local;
    const manager = this._deploy.validatorManager(domain);
    expect(manager).to.not.be.undefined;
    const tx = await manager.populateTransaction.enrollValidator(
      violation.remote,
      violation.expected,
    );
    if (tx.to === undefined) throw new Error('undefined tx.to');
    return { domain, call: tx as Call };
  }
}

export function expectCalls(
  batch: CallBatch,
  domains: number[],
  count: number[],
) {
  expect(domains).to.have.lengthOf(count.length);
  domains.forEach((domain: number, i: number) => {
    expect(batch.calls.get(domain)).to.have.lengthOf(count[i]);
  });
}