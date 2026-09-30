/**
 * IEC 60870-5-101/104 peripheral address configuration.
 *
 * WinCC OA stores the IEC CA and IOA as their separate address bytes in _reference.
 * This helper configures the datapoint address only; IEC link/connection settings
 * and the WCCOAiec manager must already exist in the project.
 */
import { BaseConnection } from './BaseConnection.js';
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
export declare class IecAddress extends BaseConnection {
    addAddressConfig(params: IecAddressParams): Promise<boolean>;
    private validate;
    private reference;
    private parseReference;
    configure(params: IecAddressParams): Promise<{
        reference: string;
        directionMode: number;
    }>;
    read(dpeName: string): Promise<Record<string, unknown>>;
}
//# sourceMappingURL=IecAddress.d.ts.map