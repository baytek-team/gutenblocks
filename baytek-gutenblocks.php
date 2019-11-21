<?php
/**
 * Plugin's bootstrap file to launch the plugin.
 *
 * @package     Baytek\Gutenberg-Blocks
 * @author      Chad Sehn
 * @license     MIT
 *
 * @wordpress-plugin
 * Plugin Name: Baytek Gutenberg Blocks
 * Plugin URI:  https://baytek.ca
 * Description: A WordPress plugin for housing handy Gutenberg blocks not included in core yet or custom ones required by your site.
 * Version:     0.1.2
 * Author:      Chad Sehn <chad@baytek.ca>
 * Author URI:  https://baytek.ca
 * Text Domain: baytek-gutenberg
 * Domain Path: /languages
 * License:     MIT
 * License URI: https://opensource.org/licenses/MIT
 */

namespace Baytek\Gutenberg_Blocks;

//  Exit if accessed directly.
defined('ABSPATH') || exit;

/**
 * Gets this plugin's absolute directory path.
 *
 * @since  0.1.1
 * @ignore
 * @access private
 *
 * @return string
 */
function _get_plugin_directory() {
	return __DIR__;
}

/**
 * Gets this plugin's URL.
 *
 * @since  0.1.1
 * @ignore
 * @access private
 *
 * @return string
 */
function _get_plugin_url() {
	static $plugin_url;

	if ( empty( $plugin_url ) ) {
		$plugin_url = plugins_url( null, __FILE__ );
	}

	return $plugin_url;
}

// Enqueue JS and CSS
include __DIR__ . '/lib/enqueue-scripts.php';

// Register meta boxes
// include __DIR__ . '/lib/meta-boxes.php';

// Block Templates
// include __DIR__ . '/lib/block-templates.php';

