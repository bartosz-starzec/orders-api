import { LoggerService } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';

const winstonLogger = createLogger({
    level: 'debug',
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message, ...meta }) => {
            return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
        })
    ),
    transports: [new transports.Console()],
});

export class WinstonLogger implements LoggerService {
    log(message: string, ...meta: any[]) {
        winstonLogger.info(message, ...meta);
    }
    error(message: string, ...meta: any[]) {
        winstonLogger.error(message, ...meta);
    }
    warn(message: string, ...meta: any[]) {
        winstonLogger.warn(message, ...meta);
    }
    debug(message: string, ...meta: any[]) {
        winstonLogger.debug(message, ...meta);
    }
    verbose(message: string, ...meta: any[]) {
        winstonLogger.verbose(message, ...meta);
    }
}
