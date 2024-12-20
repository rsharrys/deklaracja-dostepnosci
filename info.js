const fs = require('fs');
const path = require('path');

// Ścieżki do plików
const packageJsonPath = path.resolve(__dirname, 'package.json');
const infoJsonPath = path.resolve(__dirname, 'info.json');

// Funkcja do tworzenia pliku info.json na podstawie danych z wtyczki
const createInfoJson = (pluginPhpPath) => {
    // Wczytaj dane z pliku PHP
    fs.readFile(pluginPhpPath, 'utf8', (phpErr, phpData) => {
        if (phpErr) {
            console.error(`Nie można odczytać pliku PHP: ${pluginPhpPath}`, phpErr);
            return;
        }

        // Wyciągnij dane z nagłówka wtyczki
        const pluginHeaderRegex = /\/\*\*[\s\S]*?\*\s+Plugin Name:\s+(.+?)\s*\n[\s\S]*?\*\s+Description:\s+(.+?)\s*\n[\s\S]*?\*\s+Requires at least:\s+(.+?)\s*\n[\s\S]*?\*\s+Requires PHP:\s+(.+?)\s*\n[\s\S]*?\*\s+Version:\s+(.+?)\s*\n[\s\S]*?\*\s+Author:\s+(.+?)\s*\n[\s\S]*?\*\s+Author URI:\s+(.+?)\s*\n/;
        const match = phpData.match(pluginHeaderRegex);

        if (!match) {
            console.error('Nie można znaleźć nagłówka wtyczki w pliku PHP.');
            return;
        }

        const [_, pluginName, pluginDescription, requires, requiresPhp, version, author, authorUri] = match;

        // Przygotuj dane dla info.json
        const infoJson = {
            name: pluginName.trim(),
            slug: pluginSlug,
            author: `<a href="${authorUri.trim()}">${author.trim()}</a>`,
            author_profile: `http://profiles.wordpress.org/rafalsieminski/`,
            version: version.trim(),
            download_url: `https://wafelmedia.pl/plugins/${pluginSlug}/${pluginSlug}.zip`,
            requires: requires.trim(),
            tested: "6.7", // Możesz zaktualizować na podstawie potrzeb
            requires_php: requiresPhp.trim(),
            last_updated: new Date().toISOString().replace('T', ' ').split('.')[0],
            sections: {
                description: pluginDescription.trim(),
                installation: "",
                changelog: ""
            }
        };

        // Zapisz dane do info.json
        fs.writeFile(infoJsonPath, JSON.stringify(infoJson, null, 4), (writeErr) => {
            if (writeErr) {
                console.error('Nie można zapisać info.json:', writeErr);
                return;
            }

            console.log('Plik info.json został pomyślnie utworzony.');
        });
    });
};

// Sprawdzenie, czy istnieje package.json
fs.readFile(packageJsonPath, 'utf8', (err, packageData) => {
    if (err) {
        console.warn('Brak package.json. Tworzę info.json na podstawie pliku PHP.');

        // Jeśli brak package.json, kontynuuj tylko z plikiem PHP
        const pluginSlug = 'unknown'; // Domyślny slug
        const pluginPhpPath = path.resolve(__dirname, `${pluginSlug}.php`);
        createInfoJson(pluginPhpPath);
        return;
    }

    try {
        const packageJson = JSON.parse(packageData);
        const pluginSlug = packageJson.name || "unknown";
        const pluginPhpPath = path.resolve(__dirname, `${pluginSlug}.php`);

        // Wczytaj dane z pliku PHP i aktualizuj info.json oraz package.json
        fs.readFile(pluginPhpPath, 'utf8', (phpErr, phpData) => {
            if (phpErr) {
                console.error(`Nie można odczytać pliku PHP: ${pluginPhpPath}`, phpErr);
                return;
            }

            // Wyciągnij dane z nagłówka wtyczki
            const pluginHeaderRegex = /\/\*\*[\s\S]*?\*\s+Plugin Name:\s+(.+?)\s*\n[\s\S]*?\*\s+Description:\s+(.+?)\s*\n[\s\S]*?\*\s+Requires at least:\s+(.+?)\s*\n[\s\S]*?\*\s+Requires PHP:\s+(.+?)\s*\n[\s\S]*?\*\s+Version:\s+(.+?)\s*\n[\s\S]*?\*\s+Author:\s+(.+?)\s*\n[\s\S]*?\*\s+Author URI:\s+(.+?)\s*\n/;
            const match = phpData.match(pluginHeaderRegex);

            if (!match) {
                console.error('Nie można znaleźć nagłówka wtyczki w pliku PHP.');
                return;
            }

            const [_, pluginName, pluginDescription, requires, requiresPhp, version, author, authorUri] = match;

            // Przygotuj dane dla info.json
            const infoJson = {
                name: pluginName.trim(),
                slug: pluginSlug,
                author: `<a href="${authorUri.trim()}">${author.trim()}</a>`,
                author_profile: `http://profiles.wordpress.org/rafalsieminski/`,
                version: version.trim(),
                download_url: `https://wafelmedia.pl/plugins/${pluginSlug}/${pluginSlug}.zip`,
                requires: requires.trim(),
                tested: "6.7", // Możesz zaktualizować na podstawie potrzeb
                requires_php: requiresPhp.trim(),
                last_updated: new Date().toISOString().replace('T', ' ').split('.')[0],
                sections: {
                    description: pluginDescription.trim(),
                    installation: "",
                    changelog: ""
                }
            };

            // Zapisz dane do info.json
            fs.writeFile(infoJsonPath, JSON.stringify(infoJson, null, 4), (writeErr) => {
                if (writeErr) {
                    console.error('Nie można zapisać info.json:', writeErr);
                    return;
                }

                console.log('Plik info.json został pomyślnie utworzony.');
            });

            // Aktualizuj package.json, jeśli dane są różne
            const updatedPackageJson = {
                ...packageJson,
                version: infoJson.version,
                description: infoJson.sections.description,
                author: author,
            };

            fs.writeFile(packageJsonPath, JSON.stringify(updatedPackageJson, null, 4), (updateErr) => {
                if (updateErr) {
                    console.error('Nie można zaktualizować package.json:', updateErr);
                    return;
                }

                console.log('Plik package.json został pomyślnie zaktualizowany.');
            });
        });
    } catch (parseErr) {
        console.error('Błąd parsowania package.json:', parseErr);
    }
});
