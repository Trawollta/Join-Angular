// app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { HttpClientModule, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthInterceptor } from './interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    importProvidersFrom(
      HttpClientModule,
      BrowserAnimationsModule 
    ),
  ]
};


// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ApplicationConfig, importProvidersFrom } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { routes } from './app.routes';
// import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { authInterceptor} from './interceptor/auth.interceptor';




// export const appConfig: ApplicationConfig = {
//   providers: [provideRouter(routes),
//   provideHttpClient(withInterceptors([authInterceptor])),
//   importProvidersFrom(BrowserAnimationsModule),
//   ]
// };
