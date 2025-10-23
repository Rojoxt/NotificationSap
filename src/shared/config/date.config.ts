import { DateTime } from 'luxon';
import { Logger } from '@nestjs/common';

const logger = new Logger('DateFormatter');

export const formatToLocalDateTime = (d: any) => {
  if (!d) return d;
  try {
    // Si es string ISO, primero convertir a Date
    const date = typeof d === 'string' ? new Date(d) : d;
    // Convertir explícitamente a zona Lima y formatear
    const dt = DateTime.fromJSDate(date).setZone('America/Lima', { keepLocalTime: true });
    const formatted = dt.toFormat("yyyy-MM-dd'T'HH:mm:ss");
    return formatted;
  } catch (error) {
    logger.error(`Error formatting date ${d}: ${error.message}`);
    return d;
  }
};

export const convertDates = (value: any): any => {
  if (value == null) return value;
  
  try {
    // Para Date objects
    if (value instanceof Date) {
      return formatToLocalDateTime(value);
    }
    
    // Para strings ISO
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      return formatToLocalDateTime(value);
    }
    
    // Para arrays
    if (Array.isArray(value)) {
      return value.map(v => convertDates(v));
    }
    
    // Para objetos (incluyendo DTOs)
    if (typeof value === 'object') {
      const out: any = {};
      for (const [k, v] of Object.entries(value)) {
        // Si la propiedad termina en DateTime, asegurarse de procesarla
        if (k.toLowerCase().includes('datetime')) {
          out[k] = formatToLocalDateTime(v);
        } else {
          out[k] = convertDates(v);
        }
      }
      return out;
    }
    
    return value;
  } catch (error) {
    logger.error(`Error converting dates: ${error.message}`);
    return value;
  }
};