// Dictionary to store Rumi to Jawi mappings
let rumiJawiDict = {};
let rumiWords = []; // Array of all Rumi words for autocomplete
let isLoaded = false;
let selectedIndex = -1;

// Load CSV file
async function loadDictionary() {
    try {
        const response = await fetch('rumi-jawi-unicode.csv');
        const text = await response.text();

        // Parse CSV
        const lines = text.trim().split('\n');
        lines.forEach(line => {
            const [rumi, jawi] = line.split(',');
            if (rumi && jawi) {
                const rumiKey = rumi.toLowerCase().trim();
                // Store in lowercase for case-insensitive lookup
                rumiJawiDict[rumiKey] = jawi.trim();
                rumiWords.push(rumiKey);
            }
        });

        // Sort words for better autocomplete
        rumiWords.sort();
        isLoaded = true;
        document.getElementById('status').textContent = `${Object.keys(rumiJawiDict).length.toLocaleString()} perkataan dimuat`;
        console.log('Dictionary loaded:', Object.keys(rumiJawiDict).length, 'words');
    } catch (error) {
        console.error('Error loading dictionary:', error);
        document.getElementById('status').textContent = 'Gagal memuatkan kamus';
    }
}

// Get autocomplete suggestions
function getAutocompleteSuggestions(input, maxResults = 8) {
    if (!input || input.length < 1) return [];

    const normalizedInput = input.toLowerCase().trim();
    const suggestions = [];

    // First, find words that start with the input
    for (const word of rumiWords) {
        if (word.startsWith(normalizedInput)) {
            suggestions.push(word);
            if (suggestions.length >= maxResults) break;
        }
    }

    // If we don't have enough, find words that contain the input
    if (suggestions.length < maxResults) {
        for (const word of rumiWords) {
            if (!word.startsWith(normalizedInput) && word.includes(normalizedInput)) {
                suggestions.push(word);
                if (suggestions.length >= maxResults) break;
            }
        }
    }

    return suggestions;
}

// Find similar words
function findSimilarWords(rumi, maxResults = 10) {
    const normalizedInput = rumi.toLowerCase().trim();
    const similar = [];

    for (const word in rumiJawiDict) {
        if (word.includes(normalizedInput) || normalizedInput.includes(word)) {
            similar.push(word);
        }
    }

    return similar.slice(0, maxResults);
}

// Convert Rumi to Jawi
function convertToJawi(rumi) {
    if (!isLoaded) {
        return { main: '<span class="loading">Memuatkan kamus...</span>', similar: [] };
    }

    if (!rumi || rumi.trim() === '') {
        return { main: '-', similar: [] };
    }

    // Normalize input (lowercase and trim)
    const normalizedInput = rumi.toLowerCase().trim();

    // Look up in dictionary
    const jawi = rumiJawiDict[normalizedInput];

    if (jawi) {
        // Find similar words
        const similar = findSimilarWords(normalizedInput);
        return { main: jawi, similar: similar.filter(w => w !== normalizedInput) };
    } else {
        // Try to find similar words
        const similar = findSimilarWords(normalizedInput);
        return {
            main: '<span class="not-found">Tidak dijumpai dalam kamus</span>',
            similar: similar
        };
    }
}

// Show autocomplete dropdown
function showAutocomplete(suggestions) {
    const dropdown = document.getElementById('autocompleteDropdown');
    selectedIndex = -1;

    if (suggestions.length === 0) {
        dropdown.classList.remove('show');
        return;
    }

    dropdown.innerHTML = suggestions.map((word, index) =>
        `<div class="autocomplete-item" data-word="${word}" data-index="${index}">
            <span class="rumi">${word}</span>
            <span class="jawi">${rumiJawiDict[word]}</span>
        </div>`
    ).join('');

    dropdown.classList.add('show');
}

// Hide autocomplete dropdown
function hideAutocomplete() {
    document.getElementById('autocompleteDropdown').classList.remove('show');
    selectedIndex = -1;
}

// Select word from autocomplete
function selectWord(word) {
    document.getElementById('rumiInput').value = word;
    hideAutocomplete();
    updateOutput(word);
}

// Update output display
function updateOutput(rumiText) {
    const jawiOutput = document.getElementById('jawiOutput');
    const similarWords = document.getElementById('similarWords');

    const result = convertToJawi(rumiText);
    jawiOutput.innerHTML = result.main;

    // Display similar words
    if (result.similar.length > 0) {
        similarWords.innerHTML = result.similar.map(word =>
            `<div class="similar-word" data-word="${word}">
                <span class="rumi">${word}</span>
                <span class="jawi">${rumiJawiDict[word]}</span>
            </div>`
        ).join('');
        similarWords.style.display = 'block';
    } else {
        similarWords.style.display = 'none';
    }
}

// Event listener for input
document.getElementById('rumiInput').addEventListener('input', (e) => {
    const rumiText = e.target.value;

    // Show autocomplete
    if (isLoaded && rumiText.trim().length > 0) {
        const suggestions = getAutocompleteSuggestions(rumiText);
        showAutocomplete(suggestions);
    } else {
        hideAutocomplete();
    }

    // Update output
    updateOutput(rumiText);
});

// Handle keyboard navigation
document.getElementById('rumiInput').addEventListener('keydown', (e) => {
    const dropdown = document.getElementById('autocompleteDropdown');
    const items = dropdown.querySelectorAll('.autocomplete-item');

    if (!dropdown.classList.contains('show') || items.length === 0) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
        updateSelection(items);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        updateSelection(items);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < items.length) {
            const word = items[selectedIndex].dataset.word;
            selectWord(word);
        }
    } else if (e.key === 'Escape') {
        hideAutocomplete();
    }
});

// Update visual selection
function updateSelection(items) {
    items.forEach((item, index) => {
        if (index === selectedIndex) {
            item.classList.add('selected');
            item.scrollIntoView({ block: 'nearest' });
        } else {
            item.classList.remove('selected');
        }
    });
}

// Handle clicks on autocomplete items
document.addEventListener('click', (e) => {
    const autocompleteItem = e.target.closest('.autocomplete-item');
    if (autocompleteItem) {
        const word = autocompleteItem.dataset.word;
        selectWord(word);
        return;
    }

    // Handle clicks on similar words
    const similarWord = e.target.closest('.similar-word');
    if (similarWord) {
        const word = similarWord.dataset.word;
        document.getElementById('rumiInput').value = word;
        updateOutput(word);
        return;
    }

    // Hide autocomplete when clicking outside
    if (!e.target.closest('.input-wrapper')) {
        hideAutocomplete();
    }
});

// Load dictionary on page load
loadDictionary();
