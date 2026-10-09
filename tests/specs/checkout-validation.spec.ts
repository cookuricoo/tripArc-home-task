import { expect } from '@wdio/globals';
import { CatalogPage, ProductDetailsPage, CartPage, LoginPage, ShippingPage, PaymentPage } from '../../src/pages/index.js';
import { FixtureHelper } from '../../src/helpers/FixtureHelper.js';
import { credentials, shippingDetails } from '../../src/data/fixtures.js';

describe('Shipping validation', () => {
  it('rejects missing shipping details and accepts corrected data', async () => {
    const details = new ProductDetailsPage();
    const shipping = new ShippingPage();
    await new CatalogPage().openProduct(FixtureHelper.product().name);
    await details.addToCart();
    await details.openCart();
    await new CartPage().proceedToCheckout();
    await new LoginPage().signIn(credentials);
    await shipping.waitUntilReady();
    await shipping.submitShipping();
    expect(await shipping.readNameValidation()).toBe('Please provide your full name.');
    await shipping.dismissValidation();
    expect(await shipping.isCurrentScreen()).toBe(true);
    await shipping.fillAddress(shippingDetails);
    await shipping.submitShipping();
    await new PaymentPage().waitUntilReady();
    expect(await shipping.isCurrentScreen()).toBe(false);
  });
});
