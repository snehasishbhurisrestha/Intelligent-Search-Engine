$(document).ready(function() {
    let data = [];
    const invertedIndex = {};

    // Load JSON data
    $.getJSON('product.json', function(products) {
        data = products;
        buildIndex(data);
    });

    // Function to tokenize text
    function tokenize(text) {
        return text.toLowerCase().match(/\w+/g);
    }

    // Function to build the inverted index
    function buildIndex(data) {
        data.forEach((product, productId) => {
            ['name', 'description'].forEach(field => {
                const tokens = tokenize(product[field] || "");
                tokens.forEach(token => {
                    if (!invertedIndex[token]) {
                        invertedIndex[token] = new Set();
                    }
                    invertedIndex[token].add(productId);
                });
            });
        });
    }

    // Function to perform search
    function search(keyword) {
        const token = keyword.toLowerCase();
        const results = invertedIndex[token] ? Array.from(invertedIndex[token]) : [];
        return results.map(id => data[id]);
    }

    // Event listener for input event on search bar
    $('#search-input').on('input', function() {
        const keyword = $(this).val();
        const results = search(keyword);
        displayResults(results);
    });

    // Function to display search results
    function displayResults(results) {
        const resultsContainer = $('#search-results');
        resultsContainer.empty();
        if (results.length === 0) {
            resultsContainer.append('<p class="text-danger">No results found</p>');
        } else {
            results.forEach(product => {
                resultsContainer.append(`
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                        </div>
                    </div>
                `);
            });
        }
    }
});
