import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import {
  IPageSeoData,
  ISeoImage,
  ISeoTwitter,
  SeoDefaultsToken
} from './shared/models';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document,
    @Optional() @Inject(SeoDefaultsToken) private defaults: IPageSeoData = {}
  ) {}

  public generateTags(definitions: MetaDefinition[]): void {
    definitions.forEach(meta => {
      this.meta.updateTag(meta);
    });
  }

  public set(seoData: IPageSeoData) {
    seoData = {
      ...this.defaults,
      ...seoData
    };
    if (seoData.title) this.setTitle(seoData.title);
    if (seoData.keywords) this.setKeywords(seoData.keywords);
    if (seoData.description) this.setDescription(seoData.description);
    if (seoData.url) this.setUrl(seoData.url);
    if (seoData.type) this.setType(seoData.type);
    if (seoData.image) this.setImage(seoData.image);
    if (seoData.twitter) this.setTwitter(seoData.twitter);
    if (seoData.fbAppId) this.setFbAppId(seoData.fbAppId);
    if (seoData.siteName) this.setSiteName(seoData.siteName);
    if (seoData.extra) this.generateTags(seoData.extra);
  }

  public setTitle(title: string): void {
    this.title.setTitle(title);
    this.generateTags([
      { property: 'og:title', content: title },
      { name: 'twitter:title', content: title },
      { name: 'title', content: title }
    ]);
  }

  public setKeywords(keywords: string): void {
    this.generateTags([{ name: 'keywords', content: keywords }]);
  }

  public setDescription(description: string): void {
    this.generateTags([
      { name: 'description', content: description },
      { property: 'og:description', content: description },
      { name: 'twitter:description', content: description }
    ]);
  }

  public setUrl(url: string): void {
    this.generateTags([{ property: 'og:url', content: url }]);
    // set canonical link
    const oldElement = this.document.head.querySelector(
      `link[rel='canonical']`
    );
    if (oldElement) {
      this.document.head.removeChild(oldElement);
    }
    const link: HTMLLinkElement = this.document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    this.document.head.appendChild(link);
  }

  public setType(type: string): void {
    this.generateTags([{ property: 'og:type', content: type }]);
  }

  public setImage(image: string | ISeoImage): void {
    if (typeof image === 'string') {
      this.generateTags([
        { property: 'og:image', content: image },
        { name: 'twitter:image', content: image },
        { property: 'image', content: image }
      ]);
    } else {
      this.generateTags([
        { property: 'og:image', content: image.url },
        { name: 'twitter:image', content: image.url },
        { property: 'image', content: image.url }
      ]);
      if (image.url.startsWith('https')) {
        this.generateTags([
          { property: 'og:image:secure_url', content: image.url }
        ]);
      }
      if (image.alt) {
        this.generateTags([
          { name: 'twitter:image:alt', content: image.alt },
          { property: 'og:image:alt', content: image.alt }
        ]);
      }
      if (image.height) {
        this.generateTags([
          { property: 'og:image:height', content: image.height.toString() }
        ]);
      }
      if (image.width) {
        this.generateTags([
          { property: 'og:image:width', content: image.width.toString() }
        ]);
      }
      if (image.width) {
        this.generateTags([
          { property: 'og:image:type', content: `${image.mimeType}` }
        ]);
      }
    }
  }

  public setTwitter(twitterData: ISeoTwitter): void {
    if (twitterData.site) {
      this.generateTags([{ name: 'twitter:site', content: twitterData.site }]);
    }
    if (twitterData.creator) {
      this.generateTags([
        { name: 'twitter:creator', content: twitterData.creator }
      ]);
    }
    if (twitterData.card) {
      this.generateTags([{ name: 'twitter:card', content: twitterData.card }]);
    }
  }
  public setFbAppId(Id: string): void {
    this.generateTags([{ property: 'fb:app_id', content: Id }]);
  }

  public setSiteName(siteName: string): void {
    this.generateTags([{ property: 'og:site_name', content: siteName }]);
  }
}
