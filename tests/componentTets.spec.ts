import {test, expect} from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:4200/');
})

test.describe('Form Layouts page', () => {
    test.beforeEach(async ({page}) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
    })

    test('Fill out the form', async ({page}) => {
        const usingTheGridInpt = page.locator('nb-card').filter({hasText: 'Using the Grid'}).getByRole('textbox', {name: 'Email'});

        await usingTheGridInpt.fill('test@test.com');
        await usingTheGridInpt.clear();
        await usingTheGridInpt.pressSequentially('test-one@test.com');

        expect(await usingTheGridInpt.inputValue()).toBe('test-one@test.com');
        await expect(usingTheGridInpt).toHaveValue("test-one@test.com");
    })

    test("Radio button", async ({page}) => {
        const usingTheGridForm = page.locator('nb-card').filter({hasText: 'Using the Grid'});

        await usingTheGridForm.getByLabel('Option 1').check({force: true});
        await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).check({force: true});

        const isChecked = await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).isChecked();

        expect(isChecked).toBeTruthy();
        expect(usingTheGridForm.getByLabel('Option 1')).not.toBeChecked();
    })    
})

test.describe('checkboxes', () => {
    test.beforeEach(async ({page}) => {
        await page.getByText('Modal & Overlays').click();
        await page.getByText('Toastr').click();
    })

    test('Check all checkboxes', async ({page}) => {
        await page.getByRole('checkbox', {name: 'Hide on click'}).click({force: true});

    })
})