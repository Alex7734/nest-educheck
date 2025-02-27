import { SetMetadata, CustomDecorator } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = (): CustomDecorator => SetMetadata('isPublic', true);
