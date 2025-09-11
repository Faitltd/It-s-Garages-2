/// <reference types="@sveltejs/kit" />

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      userId?: string;
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {};

