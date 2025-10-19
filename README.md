# Rumi ke Jawi

A web-based Malay Rumi to Jawi script converter with autocomplete functionality.

## Description

This application converts Malay words written in Rumi (Latin script) to Jawi (Arabic script). It includes an autocomplete feature that suggests words as you type and displays related words when a match is found.

## Features

- **Real-time conversion**: Converts Rumi text to Jawi as you type
- **Autocomplete**: Suggests words while typing (up to 8 suggestions)
- **Similar words**: Shows related words when a conversion is found
- **Keyboard navigation**: Use arrow keys to navigate autocomplete suggestions
- **Dictionary**: Contains thousands of Malay word mappings

## Files

- `index.html` - Main HTML file with UI and styling
- `app.js` - JavaScript application logic
- `rumi-jawi-unicode.csv` - Dictionary file containing Rumi-Jawi word pairs

## Getting Started

### Starting the Server

Since this application loads external files (CSV), you need to run it through a local web server due to CORS restrictions.

**Option 1: Using Python**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option 2: Using Node.js**
```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server -p 8000
```

**Option 3: Using PHP**
```bash
php -S localhost:8000
```

Then open your browser and navigate to: `http://localhost:8000`

### Using the Application

1. Type a Malay word in Rumi script (e.g., "abad", "sakit", "rumah")
2. View the Jawi conversion in the output area
3. Select from autocomplete suggestions or browse related words

### Keyboard Shortcuts

- **Arrow Down/Up**: Navigate through autocomplete suggestions
- **Enter**: Select highlighted suggestion
- **Escape**: Close autocomplete dropdown

## Data Format

The dictionary file (`rumi-jawi-unicode.csv`) contains comma-separated values:
```
rumi,jawi
abad,ابد
sakit,ساکيت
```

## Technical Details

- Pure HTML/CSS/JavaScript (no frameworks required)
- Client-side processing (no server needed)
- Responsive design
- RTL text support for Jawi script
- Uses Unicode for proper Jawi character rendering

## Browser Compatibility

Works in all modern browsers that support:
- ES6+ JavaScript
- CSS Grid/Flexbox
- Unicode character rendering

## License

Free to use for educational and personal purposes.
