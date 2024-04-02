import { test, expect } from '@playwright/test';

const text: any = "Hello World";
function sum(a: any, b: any): number {   
    return a + b;  }

test("User facing locators", async ({ page }) => {
    await page.goto("http://localhost:4200/pages/forms/layouts")
    await page.getByRole('textbox', { name: 'Email' }).first().click();
    await page.getByRole('button', { name: 'Sign in' }).first().click();
    await page.getByLabel('Email').first().click();
    await page.getByPlaceholder('Jane Doe').click();
    await page.getByText('Using the Grid').click();
    await page.getByTitle('IoT Dashboard').click();  
})

test("Child elements locators", async ({ page }) => {
    await page.goto("http://localhost:4200/pages/forms/layouts")
    await page.locator('nb-card nb-radio :text-is("Option 1")').click();
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click();
    await page.locator('nb-card').getByRole('button', { name: 'Sign in' }).first().click();
    await page.locator('nb-card').nth(3).getByRole('button').first().click();
})

test("Parent elements locators", async ({ page }) => {
    await page.goto("http://localhost:4200/pages/forms/layouts")
    //the same
    await page.locator('nb-card', {hasText: 'Using the Grid'})
    .getByRole(('textbox'), { name: 'Email' }).click();   
    await page.locator('nb-card', {has: page.locator('#inputEmail1')})
    .getByRole('textbox', { name: 'Email' }).click();

    //the same
    await page.locator('nb-card')
    .filter({hasText: 'Basic form'})
    .getByRole('textbox', { name: 'Email' }).click();
    await page.locator('nb-card')
    .filter({has: page.locator('.status-danger')})
    .getByRole('textbox', { name: 'Email' }).click();

    await page.locator('nb-card')
    .filter({has: page.locator('nb-checkbox')})
    .filter({hasText: "Sign in"})
    .getByRole('textbox', { name: 'Email' }).click();

    await page.locator(':text-is("Using the Grid")')
    .locator("..")
    .getByRole('textbox', { name: 'Email' }).click();
})

test("Reusable locators", async ({ page }) => {
    const conteiner = page.locator('nb-card').filter({hasText: 'Basic form'});
    const emailTextBox = conteiner.getByRole('textbox', { name: 'Email' });
    const passwordTextBox = conteiner.getByRole('textbox', { name: 'Password' });

    await page.goto("http://localhost:4200/pages/forms/layouts");
    await emailTextBox.fill("mrsulaev@gmail.com");
    await passwordTextBox.fill("123QWER");
    await conteiner.locator('nb-checkbox').click();
    await conteiner.getByRole('button').click();

    await expect(emailTextBox).toHaveValue("mrsulaev@gmail.com");
})

test("Exctract value from element", async ({ page }) => {
    const conteiner = page.locator('nb-card').filter({hasText: 'Basic form'});
    await page.goto("http://localhost:4200/pages/forms/layouts");
    const textBtn = await conteiner.getByRole('button').textContent();
    await expect(textBtn).toBe("Submit");
    await expect(await page.locator('nb-radio').allTextContents()).toContain("Option 1");
    const emailTextBox = conteiner.getByRole('textbox', { name: 'Email' });
    await emailTextBox.fill("mrsulaev@gmail.com");
    const emailValue = await emailTextBox.inputValue(); 
    expect(emailValue).toEqual("mrsulaev@gmail.com");  

    const placeholder = await emailTextBox.getAttribute('placeholder');
    expect(placeholder).toEqual("Email");
})

test("Assertions", async ({ page }) => {
    await page.goto("http://localhost:4200/pages/forms/layouts");
    await expect(page.locator('nb-card').filter({hasText: 'Using the Grid'})).toBeVisible();
    await expect(page.locator('nb-card').filter({hasText: 'Using the Grid'})).not.toBeHidden();
    await expect(page.locator('nb-card').filter({hasText: 'Using the Grid'})).toBeEnabled();
    await expect(page.locator('nb-card').filter({hasText: 'Using the Grid'})).not.toBeDisabled();
    await expect(page.locator('nb-card').filter({hasText: 'Using the Grid'})).not.toBeFocused();
    await expect(page.locator('nb-card').filter({hasText: 'Using the Grid'})).not.toBeChecked();
    await expect(page.locator('nb-card').filter({hasText: 'Using the Grid'})).toHaveText("Using the Grid");
    await expect(page.locator('nb-card').filter({hasText: 'Using the Grid'})).toHaveText(/Using the/);
    await expect(page.locator('nb-card').filter({hasText: 'Using the Grid'})).toHaveText("Using the Grid", {ignoreCase: true});
    await expect(page.locator('nb-card').filter({hasText: 'Using the Grid'})).toHaveText("Using the Grid", {timeout: 5000});
})

test("Autowating for elements", async ({ page }) => {
    //https://playwright.dev/docs/actionability
    await page.goto("http://uitestingplayground.com/ajax");
    await page.locator('#ajaxButton').click();
    const successBtn = page.locator('bg-success');

    await page.waitForSelector('.bg-success');
    await successBtn.waitFor({state: 'attached'});
    await expect(successBtn).toHaveText("Data loaded with AJAX get request.", {timeout: 20000});

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
});

test("Interacting with elements", async ({ page }) => {
    await page.goto("http://localhost:4200/pages/forms/layouts");
    await page.getByPlaceholder('Jane Doe').fill("Test Testovich");
    expect(page.getByPlaceholder('Jane Doe')).toHaveValue("Test Testovich");
});

test('Inline form', async ({page}) => {
    await page.goto('http://localhost:4200/pages/forms/layouts');
    const inpt = page.getByPlaceholder( 'Jane Doe');
    await inpt.fill("Test Testovich");
    await expect(inpt).toHaveValue("Test Testovich");
    });
