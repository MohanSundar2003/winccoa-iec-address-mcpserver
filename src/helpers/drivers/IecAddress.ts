/**
 * IEC 60870-5-101/104 peripheral address configuration.
 *
 * WinCC OA stores the IEC CA and IOA as their separate address bytes in _reference.
 * This helper configures the datapoint address only; IEC link/connection settings
 * and the WCCOAiec manager must already exist in the project.
 */
import { BaseConnection } from './BaseConnection.js';
import { DpAddressDirection, DpConfigType } from '../../types/winccoa/constants.js';
import type { DpAddressConfig } from '../../types/winccoa/manager.js';

export type IecProtocol = '101' | '104';
export type IecSignalDirection = 'input' | 'output' | 'io';

export interface ParsedIecReference {
  /** Connection prefix encoded in _reference (Connection-Type.CA.IOA). */
  referenceConnectionName?: string;
  typeId: number;
  quality?: number;
  commonAddress: number;
  commonAddressBytes: [number, number];
  ioa: number;
  ioaBytes: [number, number, number];
}

// IEC 60870-5 type identifiers shown in the WinCC OA IEC address panel.
// Keep unknown identifiers visible as "Type N" rather than guessing a label.
const iecTypeText: Record<number, string> = {
  1: 'Single-point information',
  2: 'Single-point information with time tag CP24Time2a',
  3: 'Double-point information',
  4: 'Double-point information with time tag CP24Time2a',
  5: 'Step position information',
  6: 'Step position information with time tag CP24Time2a',
  7: 'Bitstring of 32 bits',
  8: 'Bitstring of 32 bits with time tag CP24Time2a',
  9: 'Measured value, normalized value',
  10: 'Measured value, normalized value with time tag CP24Time2a',
  11: 'Measured value, scaled value',
  12: 'Measured value, scaled value with time tag CP24Time2a',
  13: 'Measured value, short floating point number',
  14: 'Measured value, short floating point number with time tag CP24Time2a',
  15: 'Integrated totals',
  16: 'Integrated totals with time tag CP24Time2a',
  17: 'Event of protection equipment',
  18: 'Packed start events of protection equipment',
  19: 'Packed output circuit information of protection equipment',
  20: 'Packed single-point information',
  21: 'Measured value, normalized value without quality descriptor',
  30: 'Single-point information with time tag CP56Time2a',
  31: 'Double-point information with time tag CP56Time2a',
  32: 'Step position information with time tag CP56Time2a',
  33: 'Bitstring of 32 bits with time tag CP56Time2a',
  34: 'Measured value, normalized value with time tag CP56Time2a',
  35: 'Measured value, scaled value with time tag CP56Time2a',
  36: 'Measured value, short floating point number with time tag CP56Time2a',
  37: 'Integrated totals with time tag CP56Time2a',
  45: 'Single command',
  46: 'Double command',
  47: 'Regulating step command',
  48: 'Set-point command, normalized value',
  49: 'Set-point command, scaled value',
  50: 'Set-point command, short floating point number',
  51: 'Bitstring of 32 bits command',
  58: 'Single command with time tag CP56Time2a',
  59: 'Double command with time tag CP56Time2a',
  60: 'Regulating step command with time tag CP56Time2a',
  61: 'Set-point command, normalized value with time tag CP56Time2a',
  62: 'Set-point command, scaled value with time tag CP56Time2a',
  63: 'Set-point command, short floating point number with time tag CP56Time2a',
  64: 'Bitstring of 32 bits command with time tag CP56Time2a'
};

const directionText: Record<number, { direction: string; mode: string }> = {
  1: { direction: 'Output', mode: 'group' },
  2: { direction: 'Input', mode: 'spontaneous' },
  3: { direction: 'Input', mode: 'single query' },
  4: { direction: 'Input', mode: 'polling' },
  5: { direction: 'Output', mode: 'individual' },
  6: { direction: 'Input/Output', mode: 'spontaneous' },
  7: { direction: 'Input/Output', mode: 'polling' },
  8: { direction: 'Input/Output', mode: 'single query' },
  10: { direction: 'Input', mode: 'on demand' },
  11: { direction: 'Input', mode: 'cyclic on use' },
  12: { direction: 'Input/Output', mode: 'on demand' },
  13: { direction: 'Input/Output', mode: 'cyclic on use' },
  14: { direction: 'Input', mode: 'spontaneous on use' },
  15: { direction: 'Input/Output', mode: 'spontaneous on use' }
};

export interface IecAddressParams {
  dpeName: string;
  protocol: IecProtocol;
  typeId: number;
  commonAddress: number;
  ioa: number;
  direction: IecSignalDirection;
  managerNumber: number;
  connectionName?: string;
  active?: boolean;
  quality?: number;
}

const directionMode: Record<IecSignalDirection, DpAddressDirection> = {
  input: DpAddressDirection.DPATTR_ADDR_MODE_INPUT_SPONT,
  output: DpAddressDirection.DPATTR_ADDR_MODE_OUTPUT,
  io: DpAddressDirection.DPATTR_ADDR_MODE_IO_SPONT
};

export class IecAddress extends BaseConnection {
  async addAddressConfig(params: IecAddressParams): Promise<boolean> {
    await this.configure(params);
    return true;
  }

  private validate(params: IecAddressParams): void {
    if (!params.dpeName || !params.dpeName.includes('.')) {
      throw new Error('dpeName must be a full datapoint element name, for example System1:DP.Value');
    }
    if (!['101', '104'].includes(params.protocol)) throw new Error('protocol must be "101" or "104"');
    for (const [name, value] of Object.entries({
      typeId: params.typeId,
      commonAddress: params.commonAddress,
      ioa: params.ioa,
      managerNumber: params.managerNumber
    })) {
      if (!Number.isInteger(value) || value < 0) throw new Error(`${name} must be a non-negative integer`);
    }
    if (params.typeId < 1 || params.typeId > 255) throw new Error('typeId must be between 1 and 255');
    if (params.commonAddress > 65535) throw new Error('commonAddress must be between 0 and 65535');
    if (params.ioa > 16777215) throw new Error('ioa must be between 0 and 16777215');
    if (params.managerNumber < 1 || params.managerNumber > 255) throw new Error('managerNumber must be between 1 and 255');
    if (!['input', 'output', 'io'].includes(params.direction)) throw new Error('direction must be input, output, or io');
    if (params.quality !== undefined && (!Number.isInteger(params.quality) || params.quality < 0 || params.quality > 255)) {
      throw new Error('quality must be an integer from 0 to 255');
    }
    if (params.quality !== undefined && params.direction !== 'output') {
      throw new Error('IEC quality identification is supported only for output/control direction');
    }
    if (params.connectionName !== undefined && !/^[A-Za-z0-9_][A-Za-z0-9_.-]*$/.test(params.connectionName)) {
      throw new Error('connectionName may contain letters, digits, underscore, dot, and hyphen');
    }
  }

  private reference(params: IecAddressParams): string {
    const caBytes = [(params.commonAddress >> 8) & 0xff, params.commonAddress & 0xff];
    const ioaBytes = [(params.ioa >> 16) & 0xff, (params.ioa >> 8) & 0xff, params.ioa & 0xff];
    const connectionPart = params.connectionName ? `${params.connectionName}-` : '';
    const qualityPart = params.quality === undefined
      ? ''
      : params.connectionName ? `.:${params.quality}` : `:${params.quality}`;
    return `${connectionPart}${params.typeId}${qualityPart}.${[...caBytes, ...ioaBytes].join('.')}`;
  }

  private parseReference(reference: unknown): ParsedIecReference | undefined {
    if (typeof reference !== 'string' || !reference.trim()) return undefined;
    let body = reference.trim();
    let connectionName: string | undefined;
    const hyphen = body.lastIndexOf('-');
    if (hyphen > 0 && /^\d/.test(body.slice(hyphen + 1))) {
      connectionName = body.slice(0, hyphen);
      body = body.slice(hyphen + 1);
    }
    // WinCC OA displays connection + quality as "Connection-Type.:Quality...".
    body = body.replace('.:', ':');
    const parts = body.split('.');
    const head = /^(\d+)(?::(\d+))?$/.exec(parts[0] ?? '');
    if (!head || parts.length !== 6) return undefined;
    const bytes = parts.slice(1).map(Number);
    if (bytes.some(value => !Number.isInteger(value) || value < 0 || value > 255)) return undefined;
    const [caHigh, caLow, ioaHigh, ioaMiddle, ioaLow] = bytes;
    if (caHigh === undefined || caLow === undefined || ioaHigh === undefined || ioaMiddle === undefined || ioaLow === undefined) return undefined;
    return {
      ...(connectionName ? { referenceConnectionName: connectionName } : {}),
      typeId: Number(head[1]),
      ...(head[2] !== undefined ? { quality: Number(head[2]) } : {}),
      commonAddress: caHigh * 256 + caLow,
      commonAddressBytes: [caHigh, caLow],
      ioa: ioaHigh * 65536 + ioaMiddle * 256 + ioaLow,
      ioaBytes: [ioaHigh, ioaMiddle, ioaLow]
    };
  }

  async configure(params: IecAddressParams): Promise<{ reference: string; directionMode: number }> {
    this.validate(params);
    const dpt = params.dpeName.split('.')[0]!;
    if (!this.checkDpExists(dpt)) throw new Error(`Datapoint ${dpt} was not found in the connected WinCC OA project`);

    const reference = this.reference(params);
    const address: DpAddressConfig = {
      _type: DpConfigType.DPCONFIG_PERIPH_ADDR_MAIN,
      _drv_ident: 'IEC',
      _reference: reference,
      _direction: directionMode[params.direction],
      _datatype: 0,
      _subindex: 0,
      _internal: false,
      _active: params.active ?? true
    };
    const distribution = {
      _type: DpConfigType.DPCONFIG_DISTRIBUTION_INFO,
      _driver: params.managerNumber
    };
    const success = await this.setAddressAndDistribConfig(params.dpeName, address, distribution);
    if (!success) throw new Error(`WinCC OA rejected IEC address configuration for ${params.dpeName}`);
    return { reference, directionMode: address._direction };
  }

  async read(dpeName: string): Promise<Record<string, unknown>> {
    if (!dpeName || !dpeName.includes('.')) throw new Error('dpeName must be a full datapoint element name');
    const attributes = [
      '_address.._type', '_address.._drv_ident', '_address.._reference',
      '_address.._direction', '_address.._datatype', '_address.._subindex', '_address.._connection',
      '_address.._internal', '_address.._active', '_address.._lowlevel',
      '_distrib.._type', '_distrib.._driver'
    ];
    const values = await this.winccoa.dpGet(attributes.map(attr => `${dpeName}:${attr}`)) as unknown[];
    if (!Array.isArray(values) || values.length !== attributes.length) {
      throw new Error(`WinCC OA did not return all IEC address attributes for ${dpeName}`);
    }
    const raw = Object.fromEntries(attributes.map((attribute, index) => {
      const [group, field] = attribute.split('..');
      return [`${group}.${field}`, values[index]];
    }));
    const decoded = this.parseReference(values[2]);
    const numeric = (value: unknown): number | undefined => {
      const n = typeof value === 'number' ? value : Number(value);
      return Number.isFinite(n) ? n : undefined;
    };
    const ca = decoded?.commonAddress;
    const ioa = decoded?.ioa;
    const direction = directionText[numeric(values[3]) ?? -1];
    const connection = values[6] === undefined || values[6] === null || values[6] === ''
      ? null
      : values[6];

    return {
      ...raw,
      decoded,
      panel: {
        dpeName,
        reference: values[2],
        driverNumber: values[11],
        // PARA's optional connection selector is a separate field from a
        // connection prefix embedded in the reference string.
        connectionName: connection,
        referenceConnectionName: decoded?.referenceConnectionName ?? null,
        type: decoded?.typeId ?? null,
        text: decoded?.typeId === undefined
          ? null
          : iecTypeText[decoded.typeId] ?? `IEC frame type ${decoded.typeId}`,
        commonAddress: decoded ? {
          highByte: decoded.commonAddressBytes[0],
          lowByte: decoded.commonAddressBytes[1],
          linear: ca
        } : null,
        informationObjectAddress: decoded ? {
          highByte: decoded.ioaBytes[0],
          mediumByte: decoded.ioaBytes[1],
          lowByte: decoded.ioaBytes[2],
          linear: ioa
        } : null,
        subindex: values[5],
        direction: direction?.direction ?? `Unknown (${String(values[3])})`,
        directionMode: direction?.mode ?? null,
        // The IEC panel's COT checkbox is a separate address role. The
        // _address main-config flag alone doesn't reliably expose that role,
        // so don't infer its state from _type/_reference.
        addressTypeCOT: null,
        addressActive: values[8],
        internal: values[7],
        lowLevel: values[9]
      }
    };
  }
}
