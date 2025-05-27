import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../../services/storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('🔗 Interceptor executado para:', req.url);
  
  const storageService = inject(StorageService);
  const token = storageService.getItem('token');
  console.log('🔑 Token encontrado:', token ? 'SIM' : 'NÃO');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('✅ Token adicionado ao header Authorization');
  } else {
    console.log('❌ Nenhum token encontrado para adicionar');
  }

  return next(req);
};
