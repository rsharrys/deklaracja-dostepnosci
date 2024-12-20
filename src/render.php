<?php
function display_text($text, $id, $tag = 'ul') {
    // Ustawienie domyślnego tagu w przypadku niepoprawnego wyboru
    $allowed_tags = ['ul', 'p'];
    if (!in_array($tag, $allowed_tags)) {
        $tag = 'ul';
    }

    $id_attribute = !empty($id) ? 'id="' . esc_html($id) . '"' : '';
    $lines = explode("<br>", $text);
    $html = $tag === 'ul' ? '<ul>' : ''; // Tylko dla `ul` otwieramy tag

    foreach ($lines as $line) {
        $trimmed_line = trim($line);
        if (!empty($id_attribute)) {
            // Dodawanie atrybutu `id` do linków
            $trimmed_line = preg_replace('/<a\s+([^>]*?)>/', '<a $1 ' . $id_attribute . '>', $trimmed_line);
        }
        if (!empty($trimmed_line)) {
            if ($tag === 'ul') {
                $html .= '<li>' . $trimmed_line . '</li>';
            } else {
                $html .= '<p>' . $trimmed_line . '</p>';
            }
        }
    }

    if ($tag === 'ul') {
        $html .= '</ul>'; // Tylko dla `ul` zamykamy tag
    }

    return $html;
}


function render_deklaracja_dostepnosci_block($attributes) {
    $pageTitle = isset($attributes['pageTitle']) ? esc_attr($attributes['pageTitle']) : '';

    $a11y_podmiot = isset($attributes['a11yPodmiot']) ? esc_html($attributes['a11yPodmiot']) : '';
    $a11y_nazwa_strony = isset($attributes['a11yNazwaStrony']) ? esc_html($attributes['a11yNazwaStrony']) : '';
    $a11y_url_strony = isset($attributes['a11yUrlStrony']) ? esc_url($attributes['a11yUrlStrony']) : '';

    $a11y_pub_strona = isset($attributes['a11yPubStrona']) ? esc_html($attributes['a11yPubStrona']) : '';
    $a11y_pub_strona_date = $a11y_pub_strona ? date('Y-m-d', strtotime($a11y_pub_strona)) : '';
        $timestamp_strona_pub = strtotime($a11y_pub_strona_date);
        $a11y_pub_strona_datePL = $timestamp_strona_pub ? date_i18n('j F Y', $timestamp_strona_pub) : '';

    $a11y_update_strona = isset($attributes['a11yUpdateStrona']) ? esc_html($attributes['a11yUpdateStrona']) : '';
    $a11y_update_strona_date = $a11y_update_strona ? date('Y-m-d', strtotime($a11y_update_strona)) : '';
        $timestamp_strona_update = strtotime($a11y_update_strona_date);
        $a11y_update_strona_datePL = $timestamp_strona_update ? date_i18n('j F Y', $timestamp_strona_update) : '';

    $a11y_status_zgodnosci = isset($attributes['a11yStatusZgodnosci']) ? esc_html($attributes['a11yStatusZgodnosci']) : '';

    //Niezgodność z załącznikiem
    $a11y_niezgodnosc_1 = isset($attributes['a11yNiezgodnosc1']) ? wp_kses_post($attributes['a11yNiezgodnosc1']) : '';
    //Nadmierne koszty
    $a11y_niezgodnosc_2 = isset($attributes['a11yNiezgodnosc2']) ? wp_kses_post($attributes['a11yNiezgodnosc2']) : '';
    //Treści nieobjęte przepisami
    $a11y_niezgodnosc_3 = isset($attributes['a11yNiezgodnosc3']) ? wp_kses_post($attributes['a11yNiezgodnosc3']) : '';

    $a11y_ocena = isset($attributes['a11yOcena']) ? esc_html($attributes['a11yOcena']) : '';
    $a11y_ocena_nazwa = isset($attributes['a11yOcenaNazwa']) ? esc_html($attributes['a11yOcenaNazwa']) : '';
    $a11y_ocena_url = isset($attributes['a11yOcenaUrl']) ? esc_url($attributes['a11yOcenaUrl']) : '';

    $a11y_pub_deklaracja = isset($attributes['a11yPubDeklaracja']) ? esc_html($attributes['a11yPubDeklaracja']) : '';
    $a11y_pub_deklaracja_date = $a11y_pub_deklaracja ? date('Y-m-d', strtotime($a11y_pub_deklaracja)) : '';
        $timestamp_dek_pub = strtotime($a11y_pub_deklaracja_date);
        $a11y_pub_deklaracja_datePL = $timestamp_dek_pub ? date_i18n('j F Y', $timestamp_dek_pub) : '';

    $a11y_update_deklaracja = isset($attributes['a11yUpdateDeklaracja']) ? esc_html($attributes['a11yUpdateDeklaracja']) : '';
    $a11y_update_deklaracja_date = $a11y_update_deklaracja ? date('Y-m-d', strtotime($a11y_update_deklaracja)) : '';
        $timestamp_dek_update = strtotime($a11y_update_deklaracja_date);
        $a11y_update_deklaracja_datePL = $timestamp_dek_update ? date_i18n('j F Y', $timestamp_dek_update) : '';

    $a11y_osoba = isset($attributes['a11yOsoba']) ? esc_html($attributes['a11yOsoba']) : ''; //kontakt
    $a11y_email = isset($attributes['a11yEmail']) ? esc_html($attributes['a11yEmail']) : '';
    $a11y_telefon = isset($attributes['a11yTelefon']) ? esc_html($attributes['a11yTelefon']) : '';
    $a11y_telefon_url =  preg_replace('/\D/', '', $a11y_telefon);

    // Architektura old - deprecated
    $a11y_architektura = isset($attributes['a11yArchitektura']) ? wp_kses_post($attributes['a11yArchitektura']) : '';

    $a11y_komunikacja = isset($attributes['a11yKomunikacja']) ? wp_kses_post($attributes['a11yKomunikacja']) : '';
    $a11y_app = isset($attributes['a11yApp']) ? wp_kses_post($attributes['a11yApp']) : '';

    $a11y_info = isset($attributes['a11yInfo']) ? wp_kses_post($attributes['a11yInfo']) : '';
    $a11y_klawiatura = isset($attributes['a11yKlawiatura']) ? wp_kses_post($attributes['a11yKlawiatura']) : '';

    $a11y_udogodnienia1 = isset($attributes['a11yUdogodnienia1']) ? wp_kses_post($attributes['a11yUdogodnienia1']) : '';
    $a11y_udogodnienia2 = isset($attributes['a11yUdogodnienia2']) ? wp_kses_post($attributes['a11yUdogodnienia2']) : '';

    $a11y_urzad_osoba = isset($attributes['a11yUrzadOsoba']) ? esc_html($attributes['a11yUrzadOsoba']) : '';
    $a11y_urzad_nazwa = isset($attributes['a11yUrzadNazwa']) ? esc_html($attributes['a11yUrzadNazwa']) : '';
    $a11y_urzad_email = isset($attributes['a11yUrzadEmail']) ? esc_html($attributes['a11yUrzadEmail']) : '';
    $a11y_urzad_telefon = isset($attributes['a11yUrzadTelefon']) ? esc_html($attributes['a11yUrzadTelefon']) : '';
    $a11y_urzad_telefon_url =  preg_replace('/\D/', '', $a11y_urzad_telefon);
    $a11y_urzad_adres = isset($attributes['a11yUrzadAdres']) ? esc_html($attributes['a11yUrzadAdres']) : '';

    ob_start();
	?>

	<div <?php echo get_block_wrapper_attributes(); ?>>
        <?php if ($pageTitle) : ?>
            <h1>Deklaracja dostępności</h1>
        <?php endif; ?>

        <section id="a11y-wstep">
            <p><span id="a11y-podmiot"><strong><?php echo $a11y_podmiot; ?></strong></span> zobowiązuje się zapewnić dostępność swojej <span id="a11y-zakres"><strong>strony internetowej</strong></span> zgodnie z przepisami ustawy z dnia 4&nbsp;kwietnia 2019&nbsp;r. o&nbsp;dostępności cyfrowej stron internetowych i&nbsp;aplikacji mobilnych podmiotów publicznych.</p>
            <p>Deklaracja dostępności dotyczy strony internetowej <a id="a11y-url" href="<?php echo $a11y_url_strony; ?>"><?php echo $a11y_nazwa_strony; ?></a>.</p>
        </section>

        <ul>
            <li>Data publikacji strony internetowej: <time id="a11y-data-publikacja" datetime="<?php echo $a11y_pub_strona_date; ?>"><?php echo $a11y_pub_strona_datePL; ?> r.</time></li>
            <li>Data ostatniej istotnej aktualizacji: <time id="a11y-data-aktualizacja" datetime="<?php echo $a11y_update_strona_date; ?>"><?php echo $a11y_update_strona_datePL; ?> r.</time></li>
        </ul>

        <h2>Stan dostępności cyfrowej</h2>
        <p id="a11y-status">Ta strona internetowa jest <strong><?php if ($a11y_status_zgodnosci === 'zgodna'): ?>w pełni zgodna<?php elseif ($a11y_status_zgodnosci === 'czesciowo-zgodna'): ?>cześciowo zgodna<?php else: ?>niezgodna<?php endif; ?></strong> z załącznikiem do ustawy o dostępności cyfrowej z dnia 4 kwietnia 2019 r. o dostępności cyfrowej stron internetowych i aplikacji mobilnych podmiotów publicznych.</p>

        <?php if ($a11y_status_zgodnosci !== 'zgodna') : ?>

            <h2>Niedostępne treści</h2>

            <?php if ($a11y_niezgodnosc_1) : ?>
                <h3>Niezgodność z załącznikiem</h3>
                <?php echo display_text($a11y_niezgodnosc_1, "", "ul"); ?>
            <?php endif; ?>

            <?php if ($a11y_niezgodnosc_2) : ?>
                <h3>Nadmierne koszty</h3>
                <?php echo display_text($a11y_niezgodnosc_2, "a11y-ocena", "ul"); ?>
            <?php endif; ?>

            <?php if ($a11y_niezgodnosc_3) : ?>
                <h3>Treści nieobjęte przepisami</h3>
                <?php echo display_text($a11y_niezgodnosc_3, "", "ul"); ?>
            <?php endif; ?>

        <?php endif; ?>

        <h3>Przygotowanie deklaracji dostępności i jej aktualizacja</h3>
        <ul>
            <li>Data sporządzenia deklaracji: <time id="a11y-data-sporzadzenie" datetime="<?php echo $a11y_pub_deklaracja_date; ?>"><?php echo$a11y_pub_deklaracja_datePL; ?> r.</time></li>
            <li>Data ostatniego przeglądu deklaracji: <time id="a11y-data-przeglad" datetime="<?php echo $a11y_update_deklaracja_date; ?>"><?php echo $a11y_update_deklaracja_datePL; ?> r.</time></li>
        </ul>

        <?php if ($a11y_ocena === 'ocena1') :  ?>
            <p>Deklarację sporządziliśmy na podstawie samooceny w oparciu o <a href="https://www.gov.pl/attachment/1a3e2bb5-6d60-4897-ac2f-07a8e91e70ed">Listę kontrolną do badania dostępności cyfrowej strony internetowej v. 2.2 (docx, 0,12MB)</a>.</p>
            <p>Raport z audytu: <?php if($a11y_ocena_url): ?><a href="<?php echo $a11y_ocena_url; ?>"><?php echo $a11y_ocena_nazwa; ?></a><?php else: ?>Brak<?php endif;?></p>
        <?php endif; ?>

        <?php if ($a11y_ocena === 'ocena2') :  ?>
            <p>Deklarację sporządziliśmy na podstawie badania przeprowadzonego przez <strong><?php echo $a11y_ocena_nazwa; ?></strong>. Wyniki badania przedstawia <a href="<?php echo $a11y_ocena_url; ?>">Raport z audytu</a>.</p>
        <?php endif; ?>

        <?php if ($a11y_ocena === 'ocena3') :  ?>
            <p>Deklarację sporządziliśmy na podstawie oświadczenia przedstawionego przez <strong><?php echo $a11y_ocena_nazwa; ?></strong>, która zadeklarowała zgodność z wytycznymi WCAG 2.1 na poziomie AA. Wykonawca przedstawił stosowne <a href="<?php echo $a11y_ocena_url; ?>">oświadczenie</a>.</p>
        <?php endif; ?>

        <?php if ($a11y_udogodnienia1 || $a11y_udogodnienia2) : ?>
            <h2>Udogodnienia, ograniczenia i inne informacje</h2>
        <?php endif; ?>

            <?php if ($a11y_udogodnienia1) : ?>
                <h3>Elementy w których zapewniono wyższy od wymaganego poziom dostępności cyfrowej</h3>
                <?php echo display_text($a11y_udogodnienia1, "", "p"); ?>
            <?php endif; ?>

            <?php if ($a11y_udogodnienia2) : ?>
                <h3>Plany likwidacji błędów dostępności cyfrowej</h3>
                <?php echo display_text($a11y_udogodnienia2, "","p"); ?>
            <?php endif; ?>

        <?php if ($a11y_klawiatura) : ?>
            <h2>Skróty klawiszowe</h2>
            <?php echo display_text($a11y_klawiatura, "","p"); ?>
        <?php endif; ?>

        <h2>Informacje zwrotne i dane kontaktowe</h2>
        <p>Wszystkie problemy z dostępnością cyfrową tej strony internetowej możesz zgłosić do <strong><span id="a11y-kontakt"><?php echo $a11y_osoba; ?></span>, </strong>mejlowo <span id="a11y-email"><a href="mailto:<?php echo $a11y_email; ?>"><?php echo $a11y_email; ?></a></span> lub telefonicznie <a href="tel:+<?php echo $a11y_telefon_url; ?>" id="a11y-telefon"><?php echo $a11y_telefon; ?></a></strong></p>
        <p>Każdy ma prawo wystąpić z żądaniem zapewnienia dostępności cyfrowej tej strony internetowej lub jej elementów.</p>
        <p>Zgłaszając takie żądanie podaj:</p>
        <ul>
            <li>swoje imię i nazwisko,</li>
            <li>swoje dane kontaktowe (np. numer telefonu, e-mail),</li>
            <li>dokładny adres strony internetowej, na której jest niedostępny cyfrowo element lub treść,</li>
            <li>opis na czym polega problem i jaki sposób jego rozwiązania byłby dla Ciebie najwygodniejszy.</li>
        </ul>
        <p>Na Twoje zgłoszenie odpowiemy najszybciej jak to możliwe, nie później niż w ciągu 7 dni od jego otrzymania.</p>
        <p>Jeżeli ten termin będzie dla nas zbyt krótki poinformujemy Cię o tym. W tej informacji podamy nowy termin, do którego poprawimy zgłoszone przez Ciebie błędy lub przygotujemy informacje w alternatywny sposób. Ten nowy termin nie będzie dłuższy niż 2 miesiące.</p>
        <p>Jeżeli nie będziemy w stanie zapewnić dostępności cyfrowej strony internetowej lub treści, wskazanej w Twoim żądaniu, zaproponujemy Ci dostęp do nich w alternatywny sposób.</p>

        <section id="a11y-procedura">
            <h3>Obsługa wniosków i skarg związanych z dostępnością</h3>
            <p>Jeżeli w odpowiedzi na Twój wniosek o zapewnienie dostępności cyfrowej, odmówimy zapewnienia żądanej przez Ciebie dostępności cyfrowej, a Ty nie zgadzasz się z tą odmową, masz prawo złożyć skargę.</p>
            <p>Skargę masz prawo złożyć także, jeśli nie zgadzasz się na skorzystanie z alternatywnego sposobu dostępu, który zaproponowaliśmy Ci w odpowiedzi na Twój wniosek o zapewnienie dostępności cyfrowej.</p>
            <p>Ewentualną skargę złóż listownie lub mailem do kierownictwa naszego urzędu:</p>
            <?php if ( $a11y_urzad_osoba || $a11y_urzad_adres || $a11y_urzad_email): ?>
                <ul>
                    <?php if ( $a11y_urzad_osoba ): ?><li><?php echo $a11y_urzad_osoba; ?><?php echo ' - '.$a11y_urzad_nazwa; ?></li><?php endif; ?>
                    <?php if ( $a11y_urzad_adres ): ?><li>Adres: <?php echo $a11y_urzad_adres; ?>,</li><?php endif; ?>
                    <?php if ( $a11y_urzad_telefon ): ?> <li>telefon: <a href="tel:+<?php echo $a11y_urzad_telefon_url; ?>"><?php echo $a11y_urzad_telefon; ?></a></strong></li><?php endif; ?>
                    <?php if ( $a11y_urzad_email ): ?> <li>mejl: <a href="mailto:<?php echo $a11y_urzad_email; ?>"> <?php echo $a11y_urzad_email; ?></a>.</li><?php endif; ?>
                </ul>
            <?php endif; ?>

            <p><a href="https://www.gov.pl/web/gov/zloz-wniosek-o-zapewnienie-dostepnosci-cyfrowej-strony-internetowej-lub-aplikacji-mobilnej">Pomocne mogą być informacje, które można znaleźć na rządowym portalu gov.pl</a>.</p>

            <p>Możesz także poinformować o tej sytuacji <a href="https://bip.brpo.gov.pl/"> Rzecznika Praw Obywatelskich</a> i poprosić o interwencję w Twojej sprawie.</p>
        </section>

        <h2>Pozostałe informacje</h2>

        <section id="a11y-architektura">
            <h3>Dostępność architektoniczna</h3>

            <?php  // Architektura old - deprecated
            if ( $a11y_architektura ) :
                echo display_text($a11y_architektura, "a11y-architektura-url", "p");
            endif;
            ?>

            <?php // Iteracja przez elementy repeatera
            foreach ( $attributes['a11yArchitekturaArray'] as $item ) {
                // Pobierz dane każdego elementu
                $miejsce = ! empty( $item['miejsce'] ) ? esc_html( $item['miejsce'] ) : '';
                $opis = ! empty( $item['opis'] ) ? wp_kses_post( $item['opis'] ) : '';
                $obraz = ! empty( $item['obraz'] ) ? esc_url( $item['obraz'] ) : '';

                // Renderuj HTML
                ?>
                <div class="group">
                    <?php if ( $miejsce ) : ?>
                        <h4><?php echo $miejsce; ?></h4>
                    <?php endif; ?>

                    <?php if ( $opis ) : ?>
                        <?php echo display_text($opis, "a11y-architektura-url", "p"); ?>
                    <?php endif; ?>

                    <?php if ( $obraz ) : ?>
                        <img src="<?php echo $obraz; ?>" alt="<?php echo $miejsce; ?>" />
                    <?php endif; ?>
                </div>
                <?php
            } ?>
        </section>

        <?php if ($a11y_app) : ?>
            <section id="a11y-aplikacje">
                <h3>Aplikacje mobilne</h3>
                <?php echo display_text($a11y_app, "", "ul"); ?>
            </section>
        <?php endif; ?>

        <?php if ($a11y_komunikacja) : ?>
            <section id="a11y-komunikacja">
                <h3>Dostępność komunikacyjno-informacyjna</h3>
                <?php echo display_text($a11y_komunikacja, "", "p"); ?>
            </section>
        <?php endif; ?>

        <div class="copyright"><a href="https://rafal.muko.pl/wordpress/deklaracja-dostepnosci-dla-wordpress/" title="Pobierz Deklarację Dostępności dla Wordpress" style="text-decoration: none;" data-version="<?php echo \wafelmediaDeklaracjaDostepnosci\PLUGIN_VERSION; ?>" >Deklaracja Dostępności dla Wordpress</a></div>

    </div>

    <?php
    return ob_get_clean();
}
