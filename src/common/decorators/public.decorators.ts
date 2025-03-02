import { SetMetadata, CustomDecorator } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = (): CustomDecorator => SetMetadata('isPublic', true);
export const isPublic = (metadata: any) => SetMetadata(IS_PUBLIC_KEY, metadata);
export const Private = () => SetMetadata('isPublic', false);
export const isPrivate = (metadata: any) => SetMetadata(IS_PUBLIC_KEY, metadata);
