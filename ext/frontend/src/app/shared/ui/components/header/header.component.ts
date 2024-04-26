import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { AuthStateService } from 'app/auth/services/auth-state.service';
import { LanguageVersion } from 'app/shared/enum/LanguageVersion';
import { ApplicationStateService } from 'app/shared/services/application-state.service';
import { ConfigurationService } from 'app/shared/services/configuration.service';
import { LangugageService } from 'app/shared/services/language.service';
import { MetricsService } from 'app/shared/services/metrics.service';
import { ContactPopupComponent } from 'app/shared/ui/components/contact/contact-popup.component';
import { VersionUpdatePopupComponent } from 'app/shared/ui/components/version-update/version-update-popup.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public LanguageVersion: typeof LanguageVersion = LanguageVersion;
  public activeLanguage$: Observable<LanguageVersion>;
  public isProVisible: boolean = false;
  public isPro: boolean;
  public isLoggedIn: boolean
  constructor(
    private languageService: LangugageService,
    private applicationStateService: ApplicationStateService,
    protected configurationService: ConfigurationService,
    private authStateService: AuthStateService,
    private dialog: MatDialog,
    private metricsService: MetricsService
  ) {
    this.activeLanguage$ = this.applicationStateService.language$;
    this.authStateService.userData$.pipe(takeUntilDestroyed()).subscribe(({isPro}) => this.isPro = isPro)
    this.authStateService.isLoggedIn$.pipe(takeUntilDestroyed()).subscribe((isLoggedIn) => this.isLoggedIn = isLoggedIn);
  }

  public changeLanguage(language: LanguageVersion): void {
    this.applicationStateService.setLanguage(language);
  }

  public changeLanguageKeydown(
    language: LanguageVersion,
    event: KeyboardEvent
  ): void {
    if (
      event instanceof KeyboardEvent &&
      (event.key === 'Enter' || event.key === ' ')
    ) {
      if (event.key === ' ') event.preventDefault();

      this.applicationStateService.setLanguage(language);
    }
  }

  public openContactModal(): void {
    this.dialog.open(ContactPopupComponent, {
      width: '500px',
    });
  }

  public openProInfoModal(): void {
    this.metricsService.markProButtonClick().subscribe();
    this.dialog.open(VersionUpdatePopupComponent, {
      width: '500px',
    });
  }

  public openContactModalKeydown(event: KeyboardEvent): void {
    if (
      event instanceof KeyboardEvent &&
      (event.key === 'Enter' || event.key === ' ')
    ) {
      if (event.key === ' ') event.preventDefault();

      this.dialog.open(ContactPopupComponent, {
        width: '500px',
      });
    }
  }

  public logOut(): void {
    this.authStateService.logout();
  }
}
