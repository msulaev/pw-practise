import {test, expect} from '@playwright/test';
import exp from 'constants';

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
        await page.getByRole('checkbox', {name: 'Hide on click'}).uncheck({force: true});
        await page.getByRole('checkbox', {name: 'Prevent arising of duplicate toast'}).check({force: true});
        const checkboxes = page.getByRole('checkbox');
        for(const box of await checkboxes.all()) {
            await box.check({force: true});
            expect(await box.isChecked()).toBeTruthy();
        }
        for(const box of await checkboxes.all()) {
            await box.uncheck({force: true});
            expect(await box.isChecked()).not.toBeTruthy();
        }
    })
})

test('Change theme', async ({page}) => {
        const ddMenu = page.locator('ngx-header nb-select');
        await ddMenu.click();

        page.getByRole('list'); // when the list is visible and has UL tag
        page.getByRole('listitem'); // when the list is visible and has LI tag

       // const optionList = page.getByRole('list').locator('nb-option');
        const optionListAlternative = page.locator('nb-option-list nb-option');

        await expect(optionListAlternative).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);

        await optionListAlternative.filter({hasText: "Dark"}).click();

        await expect(page.locator('nb-layout-header')).toHaveCSS('background-color', 'rgb(34, 43, 69)');

        const colors = {
            "Light": 'rgb(255, 255, 255)',
            "Dark": 'rgb(34, 43, 69)',
            "Cosmic": 'rgb(50, 50, 89)',
            "Corporate": 'rgb(255, 255, 255)'
        }

        for(const color in colors) {
            await ddMenu.click();
            await optionListAlternative.filter({hasText: color}).click();
            await expect(page.locator('nb-layout-header')).toHaveCSS('background-color', colors[color]);
        }
})

test('Tooltip', async ({page}) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Tooltip').click();

    const tooltipCard = page.locator('nb-card',{hasText: 'Tooltip Placements'});
    await tooltipCard.getByRole('button', {name: 'Top'}).hover();
    const tooltip = await page.locator('nb-tooltip').textContent();
    expect(tooltip).toEqual('This is a tooltip');
})

test('Tables', async ({page}) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    const targetRow = page.getByRole('row', {name: 'twitter@outlook.com'});
    await targetRow.locator(".nb-edit").click();
    await page.locator('input-editor').getByPlaceholder('Age').fill('25');
    await page.locator('.nb-checkmark').click();

    await page.locator('.ng2-smart-pagination-nav').getByText('2').click();
    const targetRowById = page.getByRole('row', {name: '11'}).filter({has: page.locator('td').nth(1).getByText('11')});
    await targetRowById.locator('.nb-edit').click();
    await page.locator('input-editor').getByPlaceholder('Age').fill('25');
    await page.locator('.nb-checkmark').click();
    await expect(targetRowById.locator('td').nth(6)).toHaveText('25');


    const ages = ["20","30","40", "200"];

    ages.forEach( async (age) => {
        await page.locator('input-filter').getByPlaceholder('Age').fill(age);
    })
    // for(const age of ages) {   
    //     await page.locator('input-filter').getByPlaceholder('Age').fill(age);
    //     await page.waitForTimeout(500);
    //     const ageRows = page.locator('tbody tr');
    //     for(let cell of await ageRows.all()) {
    //         const text = await cell.locator('td').last().textContent();
    //         if(age === "200") {
    //             expect(text).toEqual(" No data found ");
    //         } else {
    //         expect(text).toEqual(age);
    //         }
    //     }
    // }

    // ages.forEach( async age => {
    //     await page.locator('input-filter').getByPlaceholder('Age').fill(age);
    // })
})

test('Datepicker', async ({page}) => {
    await page.getByText('Forms').click();
    await page.getByText('Datepicker').click();
    const calendarInpt = page.getByPlaceholder("Form Picker");
    await calendarInpt.click();
    await page.locator('[class= "day-cell ng-star-inserted"]').getByText('17', {exact: true}).click();

})