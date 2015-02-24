describe('cats homepage', function() {
    it('should have a title', function() {
        browser.get('http://localhost:3000');

        expect(browser.getTitle()).toEqual('SOCKS (Save Our Cats and Kittens)');
    });
    it('should create a cat successfully', function() {
        browser.get('http://localhost:3000/');

        element(by.id("new-cat")).click();

        var cat = {
            name: 'Test Cat',
            color: 'Green',
            breed: 'Test Breed',
            location: 'Test Location',
            temperament: 'Test Temperament',
            owner: 'Test Owner',
            description: 'Test Description',
            notes: ['Test Note']
        };

        for (var i in cat) {
            element(by.model(i)).sendKeys(cat[i]);
        }

        element(by.id("submit")).click();

        expect(element(by.id("name").innerText)).toBe(cat.name);
    });
})
