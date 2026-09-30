/** Read-only MCP tool for IEC 60870-5-101/104 address configuration. */
import { z } from 'zod';
import { IecAddress } from '../../helpers/drivers/IecAddress.js';
import { createSuccessResponse, createErrorResponse } from '../../utils/helpers.js';
import type { ServerContext } from '../../types/index.js';

export function registerTools(server: any, _context: ServerContext): number {
  const iec = new IecAddress();
  server.tool(
    'iec-read-address',
    `Reads the IEC peripheral address configuration from a WinCC OA datapoint element. This reads configuration attributes directly; it does not read the live process value and does not modify anything.

Returns the fields in PARA's IEC Periphery panel order: DPE, reference, distribution driver number, the separate optional connection selector and reference prefix, type and frame text, CA HB/LB/linear, IOA HB/MB/LB/linear, subindex, direction and mode, and address-active state. Raw _address and _distrib values are included too. The COT checkbox is reported as unknown because it is not represented by the address attributes this tool currently reads; it is not guessed from the reference.

Use the complete DPE name, for example WCR1:425-08-NSG1.notifications.PV.`,
    { dpeName: z.string().min(3).describe('Full WinCC OA DPE name, including system prefix if applicable') },
    async ({ dpeName }: { dpeName: string }) => {
      try {
        return createSuccessResponse({ dpeName, address: await iec.read(dpeName) });
      } catch (error) {
        return createErrorResponse(`Failed to read IEC address configuration: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  );
  return 1;
}
