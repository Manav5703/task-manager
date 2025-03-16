import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any = null;
  
  constructor(private http: HttpClient) {}
  
  /**
   * Load configuration from assets/config.json
   * This allows us to override environment settings at runtime
   */
  public loadConfig(): Promise<any> {
    if (this.config) {
      return Promise.resolve(this.config);
    }
    
    return firstValueFrom(this.http.get('./assets/config.json'))
      .then(config => {
        this.config = config;
        return config;
      })
      .catch(() => {
        console.warn('Could not load config, using environment defaults');
        this.config = { apiUrl: environment.apiUrl };
        return this.config;
      });
  }
  
  /**
   * Get the API URL from config or environment
   */
  public getApiUrl(): string {
    if (this.config && this.config.apiUrl) {
      return this.config.apiUrl;
    }
    return environment.apiUrl;
  }
} 