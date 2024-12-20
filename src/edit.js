/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, RichText, MediaUpload, InspectorControls } from '@wordpress/block-editor';
import { TextControl, DateTimePicker, Popover, SelectControl, Panel, PanelBody, Button, ToggleControl } from '@wordpress/components';
import { useRef, useState } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */

export default function Edit(props) {
	const blockProps = useBlockProps();
	const { attributes, setAttributes } = props;

	const { pageTitle } = attributes;

	const onToggleShowPageTitle = (value) => {
		setAttributes({ pageTitle: value });
	};

	const [isPopoverOpen, setIsPopoverOpen] = useState({
		a11yPubStrona: false,
		a11yUpdateStrona: false,
		a11yPubDeklaracja: false,
		a11yUpdateDeklaracja: false,
	});

	const [dates, setDates] = useState({
		a11yPubStrona: attributes.a11yPubStrona || null,
		a11yUpdateStrona: attributes.a11yUpdateStrona || null,
		a11yPubDeklaracja: attributes.a11yPubDeklaracja || null,
		a11yUpdateDeklaracja: attributes.a11yUpdateDeklaracja || null,
	});

	const inputRefs = {
		a11yPubStrona: useRef(),
		a11yUpdateStrona: useRef(),
		a11yPubDeklaracja: useRef(),
		a11yUpdateDeklaracja: useRef(),
	};

	const handleDateChange = (key, date) => {
		setDates((prevDates) => ({
			...prevDates,
			[key]: date,
		}));
		setAttributes({ [key]: date });
	};

	const handleFocus = (key) => {
		setIsPopoverOpen((prevIsPopoverOpen) => ({
			...prevIsPopoverOpen,
			[key]: true,
		}));
	};

	const handleClose = (key) => {
		setIsPopoverOpen((prevIsPopoverOpen) => ({
			...prevIsPopoverOpen,
			[key]: false,
		}));
	};

	// Funkcja do dodawania nowego zestawu pól
	const addNewItem = () => {
		const newArchitekturaArray = [...(attributes.a11yArchitekturaArray || []), { miejsce: '', opis: '', obraz: '' }];
		setAttributes({ a11yArchitekturaArray: newArchitekturaArray });
	};

	const removeItem = (index) => {
		const newArchitekturaArray = [...attributes.a11yArchitekturaArray];
		newArchitekturaArray.splice(index, 1); // Usuwa element z tablicy na podanym indeksie
		setAttributes({ a11yArchitekturaArray: newArchitekturaArray });
	};

	// Funkcja do aktualizacji wartości pojedynczego zestawu pól
	const updateItem = (index, field, value) => {
		const newArchitekturaArray = [...(attributes.a11yArchitekturaArray || [])];
		newArchitekturaArray[index][field] = value;
		setAttributes({ a11yArchitekturaArray: newArchitekturaArray });
	};

	// Sprawdzanie i inicjalizacja
	if (!Array.isArray(attributes.a11yArchitekturaArray)) {
		setAttributes({ a11yArchitekturaArray: [{ miejsce: '', opis: '', obraz: '' }] });
	}

	// Ustawienie domyślnej wartości jeśli nie jest jeszcze ustawiona
	if (!attributes.a11yStatusZgodnosci) {
		setAttributes({ a11yStatusZgodnosci: 'zgodna' });
	}

	// Function to handle pageTtitle
	const onButtonLabelChange = (value) => {
		setAttributes({ pageTitle: value || __('Tytuł strony', 'wafelmedia-file-block') });
	};

	const renderDateInput = (key, label) => (
		<div key={key}>
			<label>{label}</label>
			<input
				type="text"
				value={dates[key] ? new Date(dates[key]).toLocaleDateString() : ''}
				onFocus={() => handleFocus(key)}
				readOnly
				ref={inputRefs[key]}
				placeholder="Wybierz datę"
				className='components-text-control__input'
			/>
			{isPopoverOpen[key] && (
				<Popover
					position="bottom"
					onClose={() => handleClose(key)}
					anchor={inputRefs[key].current}
				>
					<DateTimePicker
						currentDate={dates[key]}
						onChange={(date) => handleDateChange(key, date)}
						is12Hour={false}
					/>
				</Popover>
			)}
		</div>
	);

	// Opis pol w zaleznosci od oceny
	let labelOcenaNazwa;
	if (attributes.a11yOcena === 'ocena1') {
		labelOcenaNazwa = __('Tytuł dokumentu');
	} else if (attributes.a11yOcena === 'ocena2') {
		labelOcenaNazwa = __('Nazwa organu wykonującego audyt');
	} else if (attributes.a11yOcena === 'ocena3') {
		labelOcenaNazwa = __('Nazwa organu wydającego oświadczenie');
	}

	let labelOcenaDokument;
	if (attributes.a11yOcena === 'ocena1') {
		labelOcenaDokument = __('Adres dokumentu');
	} else if (attributes.a11yOcena === 'ocena2') {
		labelOcenaDokument = __('Adres dokumentu z audytu');
	} else if (attributes.a11yOcena === 'ocena3') {
		labelOcenaDokument = __('Adres oświadczenia');
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title="Ustawienia bloku" initialOpen={true}>
					<ToggleControl
						label="Pokaż tytuł bloku"
						help={__(
							"W przypadku gdy na stronie jest już tytuł <h1>Deklaracja dostępności</h1>, możesz ukryć ten tytuł.",
							"deklaracja-dostepnosci"
						)}
						checked={pageTitle}
						onChange={onToggleShowPageTitle}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div>
					<Panel>
						<PanelBody>
							<h2>Dane podmiotu i strony</h2>
							<TextControl
								label={__('Nazwa podmiotu', 'deklaracja-dostepnosci')}
								value={attributes.a11yPodmiot}
								onChange={(a11yPodmiot) => setAttributes({ a11yPodmiot })}
							/>
							<TextControl
								label={__('Nazwa strony internetowej', 'deklaracja-dostepnosci')}
								value={attributes.a11yNazwaStrony}
								onChange={(a11yNazwaStrony) => setAttributes({ a11yNazwaStrony })}
							/>
							<TextControl
								label={__('Adres strony internetowej', 'deklaracja-dostepnosci')}
								value={attributes.a11yUrlStrony}
								onChange={(a11yUrlStrony) => setAttributes({ a11yUrlStrony })}
							/>
						</PanelBody>
					</Panel>

					<Panel>
						<PanelBody>
							<h2>Daty związane ze stroną internetową</h2>
							{renderDateInput('a11yPubStrona', __('Data publikacji strony internetowej:', 'deklaracja-dostepnosci'))}
							{renderDateInput('a11yUpdateStrona', __('Data ostatniej istotnej aktualizacji strony internetowej:', 'deklaracja-dostepnosci'))}
						</PanelBody>
					</Panel>

					<Panel>
						<PanelBody>
							<h2>Stan dostępności cyfrowej</h2>
							<SelectControl
								label={__('Deklarowany status zgodności', 'deklaracja-dostepnosci')}
								value={attributes.a11yStatusZgodnosci}
								options={[
									{ label: 'w pełni zgodna', value: 'zgodna' },
									{ label: 'częściowo zgodna', value: 'czesciowo-zgodna' },
									{ label: 'niezgodna', value: 'niezgodna' },
								]}
								onChange={(a11yStatusZgodnosci) => setAttributes({ a11yStatusZgodnosci })}
							/>

							<p><a target="_blank" href="https://www.gov.pl/web/dostepnosc-cyfrowa/jak-zbadac-czy-strona-www-jest-dostepna-cyfrowo">Jak samodzielnie zbadać dostępność cyfrową strony internetowej?</a></p>

							<div style={{ marginBottom: '2rem' }}></div>

							{attributes.a11yStatusZgodnosci !== 'zgodna' && (
								<>
									<h3>Niedostępne treści</h3>
									<RichText
										tagName="div"
										style={{ border: '1px solid #ccc', padding: '1rem' }}
										value={attributes.a11yNiezgodnosc1}
										onChange={(a11yNiezgodnosc1) => setAttributes({ a11yNiezgodnosc1 })}
										placeholder={__('_____')}
									/>
									<div style={{ marginBottom: '2rem' }}><p>Sekcja jest <strong>wymagana</strong>. Wypełnij, jeśli w pytaniu o status zgodności została wybrana opcja "częściowo zgodna" lub "niezgodna". Każdą niezgodność zapisz w odrębnym wierszu.</p>
										<p>Opisując niezgodności z załącznikiem do ustawy o dostępności cyfrowej należy:</p>
										<ul class="wp-block-list">
											<li>wskazać elementy strony internetowej lub aplikacji mobilnej, które są niedostępne cyfrowo;</li>
											<li>wskazać miejsce (adres podstrony, na której wykryty został dany błąd);</li>
											<li>wskazać rodzaj błędu i jego opis prostym, nietechnicznym językiem;</li>
											<li>opisać, jeśli to możliwe, sposób alternatywnego dostępu;</li>
											<li>ewentualnie wskazać jak można obejść dany błąd dostępności cyfrowej.</li>
										</ul>
										<p>Wykryte błędy dostępności cyfrowej powinny być jak najdokładniej opisane prostym, nietechnicznym językiem. </p>
									</div>

									<h3>Nadmierne koszty</h3>
									<RichText
										tagName="div"
										style={{ border: '1px solid #ccc', padding: '1rem' }}
										value={attributes.a11yNiezgodnosc2}
										onChange={(a11yNiezgodnosc2) => setAttributes({ a11yNiezgodnosc2 })}
										placeholder={__('_____')}
									/>

									<div style={{ marginBottom: '2rem' }}><p>Wypełnij, jeśli w pytaniu o status zgodności została wybrana opcja "Częściowo zgodna" lub "Niezgodna". Przy powołaniu się na nadmierne koszty, niezbędne jest dołączenie szczegółowych wyników oceny, o której mowa w art.8, ust.3 ustawy o dostępności cyfrowej lub link do tych wyników.</p> <p>Każde wyłączenie zapisz w odrębnym wierszu.</p></div>


									<h3>Treści nieobjęte przepisami</h3>
									<RichText
										tagName="div"
										style={{ border: '1px solid #ccc', padding: '1rem' }}
										value={attributes.a11yNiezgodnosc3}
										onChange={(a11yNiezgodnosc3) => setAttributes({ a11yNiezgodnosc3 })}
										placeholder={__('_____')}
									/>
									<div style={{ marginBottom: '2rem' }}><p>Wypełnij, jeśli w pytaniu o status zgodności została wybrana opcja "Częściowo zgodna" lub "Niezgodna". Elementy nieobjęte przepisami (art.3 ustawy o dostępności cyfrowej) należy opisać wskazując dla każdego z nich odpowiednie przepisy, uzupełniając o niezbędne, szczegółowe wyjaśnienia.</p> <p>Każde wyłączenie zapisz w odrębnym wierszu.</p></div>

								</>
							)}
						</PanelBody>
					</Panel>

					<Panel>
						<PanelBody>
							<h3>Przygotowanie deklaracji dostępności i jej aktualizacja</h3>
							{renderDateInput('a11yPubDeklaracja', __('Data sporządzenia deklaracji:', 'deklaracja-dostepnosci'))}
							{renderDateInput('a11yUpdateDeklaracja', __('Data ostatniego przeglądu deklaracji:', 'deklaracja-dostepnosci'))}
						</PanelBody>

						<PanelBody>
							<SelectControl
								label={__('Ocena audytu', 'deklaracja-dostepnosci')}
								value={attributes.a11yOcena}
								options={[
									{ label: 'wybierz', value: '' },
									{ label: 'Podstawą oceny była samoocena', value: 'ocena1' },
									{ label: 'Podstawą oceny był audyt zewnętrzny', value: 'ocena2' },
									{ label: 'Podstawą oceny było oświadczenie wykonawcy', value: 'ocena3' },
								]}
								onChange={(a11yOcena) => setAttributes({ a11yOcena })}
							/>

							{attributes.a11yOcena === 'ocena1' && (
								<p>Jeśli deklarację sporządziliśmy na podstawie samooceny. Dokument do pobrania. <a href="https://www.gov.pl/attachment/1a3e2bb5-6d60-4897-ac2f-07a8e91e70ed">Lista kontrolna do badania dostępności cyfrowej strony internetowej - wersja 2.2</a></p>
							)}

							{attributes.a11yOcena === 'ocena2' && (
								<p>Jeśli deklarację sporządziliśmy na podstawie badania przeprowadzonego przez Organizację/Firmę.</p>
							)}

							{attributes.a11yOcena === 'ocena3' && (
								<p>Jeśli deklarację sporządziliśmy na podstawie oświadczenia przedstawionego przez Organizację/Firmę, która zadeklarowała zgodność z wytycznymi.</p>
							)}

							{attributes.a11yOcena && (
								<>
									<TextControl
										label={labelOcenaNazwa}
										value={attributes.a11yOcenaNazwa}
										onChange={(a11yOcenaNazwa) => setAttributes({ a11yOcenaNazwa })}
									/>
									<TextControl
										label={labelOcenaDokument}
										value={attributes.a11yOcenaUrl}
										onChange={(a11yOcenaUrl) => setAttributes({ a11yOcenaUrl })}
									/>
								</>
							)}
						</PanelBody>
					</Panel>

					<Panel>
						<PanelBody>
							<h2>Udogodnienia, ograniczenia i inne informacje</h2>
							<h3>Elementy w których zapewniono wyższy od wymaganego poziom dostępności cyfrowej</h3>
							<RichText
								style={{ border: '1px solid #ccc', padding: '1rem' }}
								label={__('Informacje dodatkowe', 'deklaracja-dostepnosci')}
								value={attributes.a11yUdogodnienia1}
								onChange={(a11yUdogodnienia1) => setAttributes({ a11yUdogodnienia1 })}
								placeholder={__('_____')}
							/>
							<p>Sekcja jest <strong>opcjonalna</strong>.</p>

							<div style={{ marginBottom: '2rem' }}></div>

							<h3>Plany likwidacji błędów dostępności cyfrowej</h3>
							<RichText
								style={{ border: '1px solid #ccc', padding: '1rem' }}
								label={__('Informacje dodatkowe', 'deklaracja-dostepnosci')}
								value={attributes.a11yUdogodnienia2}
								onChange={(a11yUdogodnienia2) => setAttributes({ a11yUdogodnienia2 })}
								placeholder={__('_____')}
							/>
							<p>Sekcja jest <strong>opcjonalna</strong>.</p>
						</PanelBody>
					</Panel>

					<Panel>
						<PanelBody>
							<h2>Skróty klawiszowe</h2>
							<RichText
								style={{ border: '1px solid #ccc', padding: '1rem' }}
								label={__('Informacje dodatkowe', 'deklaracja-dostepnosci')}
								value={attributes.a11yKlawiatura}
								onChange={(a11yKlawiatura) => setAttributes({ a11yKlawiatura })}
								placeholder={__('_____')}
							/>
							<p>Sekcja jest <strong>opcjonalna</strong>. W sytuacji gdy istnieją niestandardowe skróty klawiszowe sekcja jest <strong>wymagana</strong>.</p>
						</PanelBody>
					</Panel>

					<Panel>
						<PanelBody>
							<h2>Informacje zwrotne i dane kontaktowe</h2>
							<TextControl
								label={__('Osoba Kontaktowa', 'deklaracja-dostepnosci')}
								value={attributes.a11yOsoba}
								onChange={(a11yOsoba) => setAttributes({ a11yOsoba })}
							/>
							<TextControl
								label={__('E-mail', 'deklaracja-dostepnosci')}
								value={attributes.a11yEmail}
								onChange={(a11yEmail) => setAttributes({ a11yEmail })}
							/>
							<TextControl
								label={__('Telefon (+48 000 000 000)', 'deklaracja-dostepnosci')}
								value={attributes.a11yTelefon}
								onChange={(a11yTelefon) => setAttributes({ a11yTelefon })}
							/>
							<p>Sekcja jest <strong>wymagana</strong>.</p>
						</PanelBody>
					</Panel>

					<Panel>
						<PanelBody>
							<h3>Obsługa wniosków i skarg związanych z dostępnością</h3>
							<TextControl
								label={__('Osoba Kontaktowa', 'deklaracja-dostepnosci')}
								value={attributes.a11yUrzadOsoba}
								onChange={(a11yUrzadOsoba) => setAttributes({ a11yUrzadOsoba })}
							/>
							<TextControl
								label={__('Nazwa organu', 'deklaracja-dostepnosci')}
								value={attributes.a11yUrzadNazwa}
								onChange={(a11yUrzadNazwa) => setAttributes({ a11yUrzadNazwa })}
							/>
							<TextControl
								label={__('E-mail', 'deklaracja-dostepnosci')}
								value={attributes.a11yUrzadEmail}
								onChange={(a11yUrzadEmail) => setAttributes({ a11yUrzadEmail })}
							/>
							<TextControl
								label={__('Telefon (+48 000 000 000)', 'deklaracja-dostepnosci')}
								value={attributes.a11yUrzadTelefon}
								onChange={(a11yUrzadTelefon) => setAttributes({ a11yUrzadTelefon })}
							/>
							<TextControl
								label={__('Adres', 'deklaracja-dostepnosci')}
								value={attributes.a11yUrzadAdres}
								onChange={(a11yUrzadAdres) => setAttributes({ a11yUrzadAdres })}
							/>

							<p>Sekcja jest <strong>wymagana</strong>.</p>
						</PanelBody>
					</Panel>

					<Panel>
						<PanelBody>
							<h2>Pozostałe informacje</h2>
							<h3>Dostępność architektoniczna</h3>
							{attributes.a11yArchitektura && (
								<RichText
									style={{ border: '1px solid #ccc', padding: '1rem' }}
									label={__('Architektura', 'deklaracja-dostepnosci')}
									value={attributes.a11yArchitektura}
									onChange={(a11yArchitektura) => setAttributes({ a11yArchitektura })}
									placeholder={__('_____')}
								/>
							)}
							<p style={{ color: 'red' }}>To pole zostało przeniesione poniżej do nowej wersji! Proszę o aktualizację deklaracji.</p>
							<div style={{ marginBottom: '2rem' }}>
								<p>Podsekcja jest <strong>wymagana</strong> W tej sekcji deklarujemy dostępność architektoniczną swojej siedziby. Podajemy przy tym adres lub adresy, jeżeli lokalizacji jest kilka, do każdej tworząc oddzielne opisy.</p>

								<p>Opis dostępności architektonicznej powinien zawierać:</p>
								<ol>
									<li>Opis dostępności wejścia do budynku i przechodzenia przez obszary kontroli.</li>
									<li>Opis dostępności korytarzy, schodów i wind.</li>
									<li>Opis dostosowań, na przykład pochylni, platform, informacji głosowych, pętlach indukcyjnych.</li>
									<li>Informacje o miejscu i sposobie korzystania z miejsc parkingowych wyznaczonych dla osób niepełnosprawnych.</li>
									<li>Informacja o prawie wstępu z psem asystującym i ewentualnych uzasadnionych ograniczeniach.</li>
									<li>Informacje o możliwości skorzystania z tłumacza języka migowego na miejscu lub online. W przypadku braku takiej możliwości, taką informację także należy zawrzeć.</li>
								</ol>
								<p>W tej sekcji można zawrzeć także inne informacje skierowane do osób niepełnosprawnych, na przykład opis sposobu dojazdu, inne sposoby porozumiewania się itp. Dobrymi praktykami są także umieszczenie informacji w tekście łatwym do czytania i zrozumienia, w języku migowym oraz dodanie fotografii budynku.</p>
								<p>Jeśli opis dostępności architektonicznej poszczególnych urzędów znajduje się na innej podstronie, można w sekcji Opis umieścić link do tej podstrony.</p>

							</div>
							{/* </PanelBody>
				</Panel>

				<Panel>
					<PanelBody> */}
							{Array.isArray(attributes.a11yArchitekturaArray) &&
								attributes.a11yArchitekturaArray.map((item, index) => (
									<div key={index} >
										<TextControl
											label={__('Miejsce', 'deklaracja-dostepnosci')}
											value={item.miejsce}
											onChange={(value) => updateItem(index, 'miejsce', value)}
											placeholder={__('Przykładowy Urząd, Adres ' + (index + 1), 'deklaracja-dostepnosci')}
										/>
										<RichText
											style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}
											value={item.opis}
											onChange={(value) => updateItem(index, 'opis', value)}
											placeholder={__('Opis', 'deklaracja-dostepnosci')}
										/>
										<div>
											{/* Podgląd wybranego obrazu */}
											{item.obraz && (
												<div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
													<img
														src={item.obraz}
														alt={__('Podgląd obrazu', 'deklaracja-dostepnosci')}
														style={{ maxWidth: '100%', height: 'auto', border: '1px solid #ccc' }}
													/>
												</div>
											)}
											{/* Obsługa biblioteki mediów WordPress */}
											<MediaUpload
												onSelect={(media) => updateItem(index, 'obraz', media.url)}
												allowedTypes={['image']}
												value={item.obraz}
												render={({ open }) => (
													<Button onClick={open} isSecondary>
														{item.obraz
															? __('Zmień obraz', 'deklaracja-dostepnosci')
															: __('Wybierz obraz', 'deklaracja-dostepnosci')}
													</Button>
												)}
											/>
										</div>
										{/* Przyciski akcji */}
										<div style={{ marginTop: '1rem', textAlign: 'right' }}>
											<Button isDestructive onClick={() => removeItem(index)}>
												{__('Usuń miejsce', 'deklaracja-dostepnosci')}
											</Button>
										</div>
									</div>
								))
							}
							<Button
								isPrimary
								onClick={addNewItem}
							>
								{__('Dodaj miejsce', 'deklaracja-dostepnosci')}
							</Button>
						</PanelBody>
					</Panel>

					<Panel>
						<PanelBody>
							<h3>Aplikacje mobilne</h3>
							<RichText
								style={{ border: '1px solid #ccc', padding: '1rem' }}
								value={attributes.a11yApp}
								onChange={(a11yApp) => setAttributes({ a11yApp })}
								placeholder={__('_____')}
							/>
							<div style={{ marginBottom: '2rem' }}>
								<p>Podsekcja jest <strong>opcjonalna</strong>. Jeżeli posiadamy i udostępniamy aplikacje mobilne, wymieniamy je tutaj wraz z linkami do pobrania. <strong>Nazwy aplikacji są linkami</strong> prowadzącymi do miejsca, z którego można pobrać aplikację, na przykład do sklepu z aplikacjami.</p>
								<p>Każdy wpis w odrębnym wierszu.</p>
							</div>
						</PanelBody>
					</Panel>

					<Panel>
						<PanelBody>
							<h3>Dostępność komunikacyjno-informacyjna</h3>
							<RichText
								style={{ border: '1px solid #ccc', padding: '1rem' }}
								value={attributes.a11yKomunikacja}
								onChange={(a11yKomunikacja) => setAttributes({ a11yKomunikacja })}
								placeholder={__('_____')}
							/>
							<div style={{ marginBottom: '2rem' }}>
								<p>Podsekcja jest <strong>wymagana</strong></p><p>W podsekcji podany jest opis dostępności komunikacyjno-informacyjnej podmiotu lub link do strony internetowej, na której taki opis jest zamieszczony.</p>
								<p>W opisie konieczne jest podanie informacji o możliwości (lub jej braku) skorzystania z pomocy tłumacza języka migowego w kontakcie z podmiotem za pośrednictwem środków komunikacji elektronicznej np. przez komunikator.</p>
								<p>Dobrą praktyką jest podanie w tej sekcji linków do informacji o danym podmiocie przygotowanych w formacie łatwym do czytania i rozumienia (tzw. ETR) oraz przetłumaczonych na polski język migowy. Można także podać inne informacje istotne dla sprawnej komunikacji z podmiotem osób z niepełnosprawnościami, np. informację o zamontowanej w budynku pętli indukcyjnej.</p>
							</div>
						</PanelBody>
					</Panel>

				</div>
			</div>
		</>
	);
}
