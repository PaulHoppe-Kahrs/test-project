<?php
/**
 * An example of a project-specific implementation.
 *
 * After registering this autoload function with SPL, the following line
 * would cause the function to attempt to load the \Foo\Bar\Baz\Qux class
 * from /path/to/project/src/Baz/Qux.php:
 *
 *      new \Foo\Bar\Baz\Qux;
 *
 * @param string $class The fully-qualified class name.
 * @return void
 */
spl_autoload_register(function ($class) {
    $prefixes = [
        'App\\controllers\\' => __DIR__ . '/controller/',
        'App\\database\\' => __DIR__ . '/data/',
        'App\\models\\' => __DIR__ . '/models/',
        'App\\Router\\' => __DIR__ . '/router/'
    ];

    foreach ($prefixes as $prefix => $base_dir) {
        $len = strlen($prefix);
        if (strncmp($prefix, $class, $len) !== 0) {
            continue;
        }

        $relative_class = substr($class, $len);
        $file = $base_dir . $relative_class . '.php';
        $lower_file = $base_dir . strtolower($relative_class) . '.php';

        if (file_exists($file)) {
            require $file;
            return;
        }

        if (file_exists($lower_file)) {
            require $lower_file;
            return;
        }
    }
});