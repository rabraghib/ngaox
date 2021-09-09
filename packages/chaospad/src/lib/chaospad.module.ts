import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [],
  imports: [HttpClientModule],
  exports: [],
  providers: [ApiService, AuthService]
})
export class ChaospadModule {
  public static forRoot(
    API_BASE: string | null = null
  ): ModuleWithProviders<ChaospadModule> {
    return {
      ngModule: ChaospadModule,
      providers: [
        {
          provide: 'API_BASE',
          useValue: API_BASE
        }
      ]
    };
  }
}