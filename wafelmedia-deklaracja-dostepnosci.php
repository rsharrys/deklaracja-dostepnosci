<?php
/**
 * Plugin Name:       Wafelmedia Deklaracja Dostepnosci
 * Description:       Prosta Deklaracja Dostępności zgodna z WCAG 2.1 jako Block dla WordPress
 * Requires at least: 6.5
 * Requires PHP:      7.4
 * Version:           1.7.0
 * Author:            Rafał Siemiński
 * Author URI:        https://rafal.muko.pl
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wafelmedia-deklaracja-dostepnosci
 *
 * @package Wafelmedia
 */

namespace wafelmediaDeklaracjaDostepnosci;

const PLUGIN_VERSION = '1.7.0';

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Update
 */
require_once( plugin_dir_path(__FILE__) . 'include/update.php');
function initialize_update_checker() {
    new \updateChecker(__FILE__, PLUGIN_VERSION);
}
add_action('plugins_loaded', __NAMESPACE__ . '\initialize_update_checker');

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function deklaracja_dostepnosci_block_init() {
		register_block_type( __DIR__ . '/build', array(
		'api_version' => 3,
		'render_callback' => 'render_deklaracja_dostepnosci_block',
		'attributes' => array(
			'a11yPodmiot' => array('type' => 'string'),
			'a11yNazwaStrony' => array('type' => 'string'),
			'a11yUrlStrony' => array('type' => 'string'),
			'a11yPubStrona' => array('type' => 'string'),
			'a11yUpdateStrona' => array('type' => 'string'),
			'a11yStatusZgodnosci' => array('type' => 'string'),
			'a11yNiezgodnosc1' => array('type' => 'string'),
			'a11yNiezgodnosc2' => array('type' => 'string'),
			'a11yNiezgodnosc3' => array('type' => 'string'),
			'a11yOcena' => array('type' => 'string'),
			'a11yOcenaNazwa' => array('type' => 'string'),
			'a11yOcenaUrl' => array('type' => 'string'),
			'a11yPubDeklaracja' => array('type' => 'string'),
			'a11yUpdateDeklaracja' => array('type' => 'string'),
			'a11yOsoba' => array('type' => 'string'),
			'a11yEmail' => array('type' => 'string'),
			'a11yTelefon' => array('type' => 'string'),
			'a11yArchitektura' => array('type' => 'string'),
			'a11yArchitekturaArray' => array(
				'type' => 'array', // Typ: tablica
				'properties' => array( // Definicja obiektów w tablicy
					'miejsce' => array(
						'type' => 'string',
						'default' => '', // Wartość domyślna
					),
					'opis' => array(
						'type' => 'string',
						'default' => '',
					),
					'obraz' => array(
						'type' => 'string',
						'default' => '',
					),
				),
			),
			'a11yKomunikacja' => array('type' => 'string'),
			'a11yUdogodnienia1' => array('type' => 'string'),
			'a11yUdogodnienia2' => array('type' => 'string'),
			'a11yApp' => array('type' => 'string'),
			'a11yInfo' => array('type' => 'string'),
			'a11yKlawiatura' => array('type' => 'string'),
			'a11yUrzadOsoba' => array('type' => 'string'),
			'a11yUrzadNazwa' => array('type' => 'string'),
			'a11yUrzadEmail' => array('type' => 'string'),
			'a11yUrzadTelefon' => array('type' => 'string'),
			'a11yUrzadAdres' => array('type' => 'string'),
			'pageTitle' => array(
                'type' => 'boolean',
                'default' => true
            	),
			),
        )
	);
}
add_action( 'init',  __NAMESPACE__ . '\deklaracja_dostepnosci_block_init' );

require_once(__DIR__ . '/build/render.php');

/**
 * Create Page
 */
function page_deklaracja_dostepnosci($post_id) {
	require_once(ABSPATH . '/wp-admin/includes/post.php');

    $title = esc_html('Deklaracja dostępności');
    $slug = esc_html('deklaracja-dostepnosci');
    $page_content = '<!-- wp:wafelmedia/deklaracja-dostepnosci /-->';
    $post_type = 'page';

    $page_args = array(
        'post_type' => $post_type,
        'post_title' => $title,
        'post_content' => $page_content,
        'post_status' => 'publish',
        'post_author' => 1,
        'post_slug' => $slug,
    );

	if (post_exists($title) === 0) {
        if (get_locale() == 'pl_PL') {
            $page_id = wp_insert_post($page_args);;
        }
    }

}
add_action( 'init',  __NAMESPACE__ . '\page_deklaracja_dostepnosci' );

/**
 * Create meta header
 */
function meta_deklaracja_dostepnosci() {
    if (get_locale() == 'pl_PL') {
        echo '<meta name="deklaracja-dostępności" content="' . esc_url( home_url( '/deklaracja-dostepnosci/' ) ) . '">';
    }
}
add_action('wp_head',  __NAMESPACE__ . '\meta_deklaracja_dostepnosci');
