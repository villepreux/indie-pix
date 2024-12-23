<?php 

header("Access-Control-Allow-Origin: *");

$title = "Indie.pix";
$desc  = "Indieweb Pictures gallery";
$url   = "https://villepreux.github.io/indie-pix/";

?><!doctype html><html lang="en-EN" class="no-js">

    <!-- Welcome to Indie.pix web page code source! //-->
 
    <head>

        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1">

        <script>

            document.documentElement.className = (document.documentElement.className.replace(/\bno-js\b/, '') + ' js').trim();

            var color_scheme = localStorage.getItem("color-scheme");

            if (null !== color_scheme) {

                document.documentElement.setAttribute("data-color-scheme", color_scheme);
            }

        </script>

        <title><?= $title ?></title>

        <style>
            <?php foreach (@file("css/all.css") as $line) echo "            $line"; ?>

        </style>

        <meta http-equiv="x-ua-compatible"  content="IE=edge">

        <meta name="title"                  content="<?= $title ?>">
        <meta name="name"                   content="<?= $title ?>">
        <meta name="description"            content="<?= $desc ?>">
        <meta name="keywords"               content="Artbook">
        <meta name="author"                 content="Antoine Villepreux">
        <meta name="copyright"              content="Antoine Villepreux">
        <meta name="fediverse:creator"      content="@villapirorum@indieweb.social">
        <meta name="format-detection"       content="telephone=no">

        <meta name="theme-color"            content="#000" media="(prefers-color-scheme: light)" >
        <meta name="theme-color"            content="#000" media="(prefers-color-scheme: dark)"  >
        <meta name="view-transition"        content="same-origin">
        <meta name="color-scheme"           content="dark light">

        <meta name="geo.region"             content="FR-75">
        <meta name="geo.placename"          content="Paris">
        <meta name="geo.position"           content="48.862808;2.348237">
        <meta name="ICBM"                   content="48.862808, 2.348237">

        <meta property="og:title"           content="<?= $title ?>">
        <meta property="og:description"     content="<?= $desc ?>">
        <meta property="og:site_name"       content="villapirorum.netlify.app">
        <meta property="og:image"           content="media/indie-pix.png">
        <meta property="og:url"             content="<?= $url ?>">
        <meta property="og:type"            content="website">

        <meta name="og:title"               content="<?= $title ?>">
        <meta name="og:description"         content="<?= $desc ?>">
        <meta name="og:site_name"           content="villapirorum.netlify.app">

        <meta itemprop="name"               content="<?= $title ?>">
        <meta itemprop="description"        content="<?= $desc ?>">

        <meta name="DC.title"               content="<?= $title ?>">
        <meta name="DC.format"              content="text/html">
        <meta name="DC.language"            content="fr-FR">

        <meta name="twitter:card"           content="summary_large_image">
        <meta name="twitter:url"            content="<?= $url ?>">
        <meta name="twitter:title"          content="<?= $title ?>">
        <meta name="twitter:description"    content="<?= $desc ?>">
        <meta name="twitter:image"          content="media/indie-pix.png">

        <meta name="application-name"       content="media/indie-pix">

        <meta name="msapplication-TileColor" content="#000">
        <meta name="msapplication-TileImage" content="media/indie-pix.png">

        <link rel="icon"        href="media/indie-pix-icon.png" type="image/png">
        <link rel="manifest"    href="manifest.json">

    </head>

    <body>

        <script type="application/ld+json">
        {
            "@context": "https:\/\/schema.org",
            "@type": "Person",
            "name": "Charlotte Villepreux",
            "url": "\/\/villepreux.net\/charlotte\/artbook",
            "sameAs": [
                "https:\/\/www.pinterest.com\/charlotte.villepreux",
                "https:\/\/www.instagram.com\/charlotte.villepreux\/"
            ]
        }
        </script>

        <script type="application/ld+json">
        {
            "@context": "https:\/\/schema.org",
            "@type": "Organization",
            "name": "<?= $desc ?>",
            "url": "\/\/villepreux.net\/charlotte\/artbook",
            "logo": "media/indie-pix.png"
        }
        </script>

        <header>
            <a href="#"><h1 id="artbook"><?= $title ?></h1></a>
            <nav>
                <!--<form>
                    <label for="filter-a"><input type="checkbox" id="filter-a" name="filter" checked></input> A </label>
                    <label for="filter-b"><input type="checkbox" id="filter-b" name="filter" checked></input> B </label>
                    <label for="filter-c"><input type="checkbox" id="filter-c" name="filter" checked></input> C </label>
                </form>//-->
            </nav>            
        </header>

        <main>

            <section id="feed">

                

            </section>

        </main>

        <footer>
            <p>© <a href="mailto:villepreux@gmail.com">Antoine Villepreux</a> 2024-<?= date("Y") ?></p>
            <p>Work in progress</p>
        </footer>

        <a href="https://pixelfed.social/villepreux/"    target="_blank" hidden="hidden" rel="me">Pixelfed </a>
        <a href="https://mastodon.social/@villapirorum/" target="_blank" hidden="hidden" rel="me">Mastodon </a>
        <a href="https://github.com/villepreux"          target="_blank" hidden="hidden" rel="me">Github   </a>

    </body>

    <script type="module">
    
        <?php foreach (@file("js/app.js") as $line) echo "        $line"; ?>

    </script>

</html>