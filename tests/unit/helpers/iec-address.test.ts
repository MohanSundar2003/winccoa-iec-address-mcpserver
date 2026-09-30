import { describe, expect, it } from 'vitest';
import { IecAddress } from '../../../src/helpers/drivers/IecAddress.js';

function fixture() {
  const helper = new IecAddress();
  const manager = (helper as any).winccoa;
  manager.dpExists.mockReturnValue(true);
  return { helper, manager };
}

describe('IEC peripheral address helper', () => {
  it('writes standard Type.CA.IOA reference and manager distribution', async () => {
    const { helper, manager } = fixture();
    const result = await helper.configure({
      dpeName: 'System1:Pump1.Value', protocol: '104', typeId: 13,
      commonAddress: 1, ioa: 1001, direction: 'input', managerNumber: 4
    });

    expect(result.reference).toBe('13.0.1.0.3.233');
    expect(manager.dpSetWait).toHaveBeenCalledOnce();
    const [dpes, values] = manager.dpSetWait.mock.calls[0];
    expect(dpes).toContain('System1:Pump1.Value:_distrib.._driver');
    expect(values).toContain('13.0.1.0.3.233');
    expect(values).toContain(4);
  });

  it('uses the documented connection and quality syntax', async () => {
    const { helper } = fixture();
    const result = await helper.configure({
      dpeName: 'System1:Pump1.Command', protocol: '101', typeId: 45,
      commonAddress: 270, ioa: 500, direction: 'output', managerNumber: 2,
      connectionName: 'Gateway1', quality: 1
    });
    expect(result.reference).toBe('Gateway1-45.:1.1.14.0.1.244');
  });

  it('decodes the byte-based reference shown in the WinCC OA IEC panel', async () => {
    const { helper, manager } = fixture();
    manager.dpGet.mockResolvedValueOnce([
      16, 'IEC', 'HMR1GTWY-30.8.253.0.85.97', 2, 0, 0,
      '', false, true, false, 56, 1
    ]);
    const result = await helper.read('WCR1:425-08-NSG1.notifications.PV');
    expect(result.decoded).toEqual({
      referenceConnectionName: 'HMR1GTWY', typeId: 30,
      commonAddress: 2301, commonAddressBytes: [8, 253],
      ioa: 21857, ioaBytes: [0, 85, 97]
    });
    expect(result['_address._direction']).toBe(2);
    expect(result['_address._active']).toBe(true);
    expect(result['_distrib._driver']).toBe(1);
    expect(result.panel).toEqual({
      dpeName: 'WCR1:425-08-NSG1.notifications.PV',
      reference: 'HMR1GTWY-30.8.253.0.85.97',
      driverNumber: 1,
      connectionName: null,
      referenceConnectionName: 'HMR1GTWY',
      type: 30,
      text: 'Single-point information with time tag CP56Time2a',
      commonAddress: { highByte: 8, lowByte: 253, linear: 2301 },
      informationObjectAddress: { highByte: 0, mediumByte: 85, lowByte: 97, linear: 21857 },
      subindex: 0,
      direction: 'Input',
      directionMode: 'spontaneous',
      addressTypeCOT: null,
      addressActive: true,
      internal: false,
      lowLevel: false
    });
  });

  it('rejects quality identification on an input address', async () => {
    const { helper } = fixture();
    await expect(helper.configure({
      dpeName: 'System1:Pump1.Value', protocol: '104', typeId: 13,
      commonAddress: 1, ioa: 1001, direction: 'input', managerNumber: 1,
      quality: 1
    })).rejects.toThrow('only for output/control direction');
  });
});
