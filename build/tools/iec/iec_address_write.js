/** Write-enabled MCP tool for IEC 60870-5-101/104 address configuration. */
import { z } from 'zod';
import { IecAddress } from '../../helpers/drivers/IecAddress.js';
import { createSuccessResponse, createErrorResponse } from '../../utils/helpers.js';
export function registerTools(server, _context) {
    const iec = new IecAddress();
    server.tool('iec-write-address', `Create or replace an IEC 60870-5-101/104 peripheral address on a datapoint element.

WinCC OA references store Type ID followed by the two common-address bytes and three IOA bytes. The address and distribution manager assignment are written together. The WCCOAiec manager and IEC connection/link configuration must already exist. This tool does not start the driver or write a process value.

Direction maps to WinCC OA modes: input=spontaneous input, output=output group, io=spontaneous input/output. Use this write tool only when address changes are intended.`, {
        dpeName: z.string().min(3).describe('Full WinCC OA DPE name'),
        protocol: z.enum(['101', '104']).describe('IEC protocol variant configured in the project'),
        typeId: z.number().int().min(1).max(255).describe('IEC type identification'),
        commonAddress: z.number().int().min(0).max(65535).describe('Linear ASDU common address, converted to two bytes'),
        ioa: z.number().int().min(0).max(16777215).describe('Linear information object address, converted to three bytes'),
        direction: z.enum(['input', 'output', 'io']).describe('I/O direction'),
        managerNumber: z.number().int().min(1).max(255).describe('WCCOAiec driver manager number, not the MCP manager number'),
        connectionName: z.string().optional().describe('Optional existing IEC connection name'),
        quality: z.number().int().min(0).max(255).optional().describe('Optional output/control quality field'),
        active: z.boolean().optional().describe('Activate the address immediately (default true)')
    }, async (params) => {
        try {
            const configured = await iec.configure(params);
            return createSuccessResponse({ ...params, ...configured, active: params.active ?? true, message: 'IEC address configured' });
        }
        catch (error) {
            return createErrorResponse(`Failed to configure IEC address: ${error instanceof Error ? error.message : String(error)}`);
        }
    });
    return 1;
}
//# sourceMappingURL=iec_address_write.js.map