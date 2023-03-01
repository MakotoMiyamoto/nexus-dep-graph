import axios from 'axios'
import parser from 'node-html-parser'

const zip = <T, U>(a: T[], b: U[]): Array<[T, U]> => {
    if (a.length != b.length) throw "Size mismatch.";
    return a.map((val, idx) => [ val, b[idx] ])
}

/// test
const main = async() => {
    const URL = "https://www.nexusmods.com/skyrimspecialedition/mods/86026";
    console.log(`Connecting to ${URL}...`);
    const { data } = await axios.get(URL);
    console.log('Parsing...');
    const html = parser.parse(data);
    console.log(`${html.querySelector('head title')?.textContent} loaded. Resolving dependencies...`);

    const TABLE_HEADER_QUERY =      '.accordionitems';
    const DEPENDENCY_NAMES_QUERY =  'td.table-require-name';
    const DEPENDENCY_NOTES_QUERY =  'td.table-require-notes';
    
    const table_header = html.querySelector(TABLE_HEADER_QUERY);
    const dependency_names = table_header?.querySelectorAll(DEPENDENCY_NAMES_QUERY);
    const dependency_notes = table_header?.querySelectorAll(DEPENDENCY_NOTES_QUERY);

    if (!dependency_names || !dependency_notes) return Promise.reject('Dependency list could not be found.');

    const dependency_table = zip(dependency_names, dependency_notes);
    dependency_table.forEach(([ name_elem, note_elem ], idx) => {
        const name = name_elem.querySelector('a')?.textContent;
        const note = note_elem.textContent;
        console.log(`${idx}) ${name} | ${note}`);
    });
}
main().catch(console.error);
