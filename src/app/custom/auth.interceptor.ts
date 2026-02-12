import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('utoken');

    if (token) {
        const cloned = req.clone({
            setHeaders: {
                authorization: token
            }
        });
        return next(cloned);
    }

    return next(req);
};
