<!DOCTYPE html>
<!-- saved from url=(0021)http://www.jstat.org/ -->
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        
        <meta name="keywords" content="JavaScript, statistics, statistical, library, probability distributions, PDF, CDF, plotting, graphs">
        <title>jStat : a JavaScript statistical library
</title>
        <link rel="stylesheet" type="text/css" media="screen" href="./jStat_files/main.css">
<link rel="stylesheet" type="text/css" media="screen" href="./jStat_files/960.css">
<link rel="stylesheet" type="text/css" media="screen" href="./jStat_files/jquery.css">
<link rel="stylesheet" type="text/css" media="screen" href="./jStat_files/prettify.css">
        <script type="text/javascript" async="" src="./jStat_files/ga.js"></script><script type="text/javascript" src="./jStat_files/jquery-1.5.1.min.js"></script>
<script type="text/javascript" src="./jStat_files/jquery-ui-1.8.9.custom.min.js"></script>
<script type="text/javascript" src="./jStat_files/jquery.flot.min.js"></script>
<script type="text/javascript" src="./jStat_files/jstat-1.0.0.min.js"></script>
<script type="text/javascript" src="./jStat_files/jquery.qtip-1.0.0-rc3.min.js"></script>
<script type="text/javascript" src="./jStat_files/home.js"></script>
<script type="text/javascript" src="./jStat_files/prettify.js"></script>
<script type="text/javascript" src="./jStat_files/twitter.js"></script>
<script type="text/javascript" src="./jStat_files/jquery.tmpl.min.js"></script>
        <!--[if IE]><script language="javascript" type="text/javascript" src="js/excanvas.min.js"></script><![endif]-->

        <meta name="description" content="jStat is a statistical library written in JavaScript. It is capable of plotting
several probability distributions as well as generating densities,
cumulative densities and quantiles.
">

        <script type="text/javascript">

            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-21571429-1']);
            _gaq.push(['_trackPageview']);

            (function() {
                var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
            })();

        </script>
        <link rel="icon" type="image/png" href="http://www.jstat.org/images/favicon.png">
    <style type="text/css"></style><style type="text/css"></style></head>
    <body>
        <div id="container">
            <div class="container_12">
                <div id="header">
                    <div class="grid_3">
                        <a href="./jStat_files/jStat.js">
                            <!--<span class="blue">j</span><span class="underline">Stat</span>-->
                            <img src="./jStat_files/jstat-logo.png" alt="jStat: a JavaScript statistics library">
                        </a>
                    </div>
                    <div class="grid_1">
                        <div id="colon">
                            &nbsp;:&nbsp;
                        </div>
                    </div>
                    <div class="grid_8">
                        <div id="page_title">
                            about                        </div>
                    </div>
                    <div class="grid_8 prefix_4">
                        <div id="menu">
                            <ul>
                                <li><a href="./jStat_files/jStat.js">About</a></li>
                                <li><a href="http://www.jstat.org/download">Download</a></li>
                                <li><a href="http://www.jstat.org/documentation">Documentation</a></li>
                                <li><a href="http://www.jstat.org/demonstration">Demonstration</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div id="body">
                    

<div class="grid_7">

    <h1>jStat : a JavaScript statistical library.</h1>
    <p>
        <strong>jStat</strong> is a statistical library written in JavaScript that
        allows you to perform advanced statistical operations without the need of
        a dedicated statistical language (i.e. <a href="http://www.mathworks.co.uk/products/matlab/" class="body">MATLAB</a> or <a href="http://www.r-project.org/" class="body">R</a>).
    </p>

    <h2><strong>jStat</strong> dependencies:</h2>

    <p>
        The majority of <strong>jStat</strong> functions can be used independently
        of any other libraries. However, the plotting functionality of <strong>jStat</strong>
        is based on the <a href="http://code.google.com/p/flot/" class="body">jQuery plugin - flot</a>.
        Therefore, to generate plots using <strong>jStat</strong> the following dependencies are required:

    </p>
    <ul>
        <li><a href="http://code.jquery.com/jquery-1.5.1.min.js" class="body">jQuery</a> - version 1.4.4+</li>
        <li><a href="http://jqueryui.com/download/" class="body">jQuery UI</a> - version 1.8.9+</li>
        <li><a href="http://code.google.com/p/flot/downloads/detail?name=flot-0.6.zip&can=2&q=" class="body">flot</a> - version 0.6+</li>
    </ul>

    <p>
        <strong>jStat</strong> only uses elements that adhere to the jQuery UI ThemeRoller
        styles so any jQuery UI theme can be used.
    </p>

    <p>
        A complete production bundle can be downloaded from the <a href="http://www.jstat.org/download" class="body">downloads page</a> that includes
        all dependencies and the <a href="https://github.com/taitems/Aristo-jQuery-UI-Theme" class="body">Aristo jQuery UI theme</a>.
    </p>

    <h2>Browser compatability</h2>
    <p>
        <strong>jStat</strong> should work in all major browsers. Most of the limitations arise
        from the use of the HTML 5 <em>canvas</em> element when plotting. Below is a list of supported browsers:
    </p>
    <ul>
        <li><strong>Internet Explorer</strong> - versions 7+</li>
        <li><strong>Firefox</strong> - version 3+</li>
        <li><strong>Safari</strong> - version 3.1+</li>
        <li><strong>Opera</strong> - version 9.6+</li>
        <li><strong>Google Chrome</strong></li>
    </ul>

    <p>
        <strong>jStat</strong> uses numerous advanced statistical functions that require
        considerable processing power. This requirement results in differing user
        experiences depending upon your browser choice. Currently, the fastest browser
        is <strong>Google Chrome</strong>. However, most browsers provide satisfactory
        performance, with the exception of <strong>Internet Explorer</strong> which
        has a significant performance hit.
    </p>

    <h2>jStat examples:</h2>
    <p>
        <strong>jStat</strong> was designed with <strong>simplicity</strong> in mind.
        Using an object-oriented design provides a clean API that can produce results in
        a few lines of code. <strong>jStat</strong> also provides a <strong>procedural</strong>
        API that mimics <a href="http://www.r-project.org/" class="body">R</a>.
    </p>
    <p>
        To demonstrate the <strong>simplicity</strong> of <strong>jStat</strong>
        a number of examples are provided below. Clicking on the 'execute' button
        will run the code of each example.
    </p>

    <h3 class="small">Calculate the 0.95 quantile of a Normal distribution:</h3>
<pre class="prettyprint lang-js"><span class="kwd">var</span><span class="pln"> norm </span><span class="pun">=</span><span class="pln"> </span><span class="kwd">new</span><span class="pln"> </span><span class="typ">NormalDistribution</span><span class="pun">(</span><span class="lit">0</span><span class="pun">,</span><span class="lit">1</span><span class="pun">)</span><span class="pln"> </span><span class="com">// normal distribution</span><span class="pln"><br></span><span class="kwd">var</span><span class="pln"> q </span><span class="pun">=</span><span class="pln"> norm</span><span class="pun">.</span><span class="pln">getQuantile</span><span class="pun">(</span><span class="lit">0.95</span><span class="pun">);</span><span class="pln"> &nbsp; &nbsp; &nbsp; &nbsp;</span><span class="com">// the 0.95 quantile</span><span class="pln"><br>alert</span><span class="pun">(</span><span class="pln">q</span><span class="pun">);</span><span class="pln"> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span><span class="com">// output the result</span></pre>
    <button id="execute-norm" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" role="button" aria-disabled="false"><span class="ui-button-icon-primary ui-icon ui-icon-wrench"></span><span class="ui-button-text">Execute</span></button>

    <h3 class="small">Calculate the cumulative density at a given point of a Beta distribution:</h3>
    <pre class="prettyprint lang-js"><span class="com">// Calculate the cumulative density of a beta distribution</span><span class="pln"><br></span><span class="kwd">var</span><span class="pln"> cumulative </span><span class="pun">=</span><span class="pln"> jstat</span><span class="pun">.</span><span class="pln">pbeta</span><span class="pun">(</span><span class="lit">0.5</span><span class="pun">,</span><span class="pln"> </span><span class="lit">2.3</span><span class="pun">,</span><span class="pln"> </span><span class="lit">4.1</span><span class="pun">);</span><span class="pln"><br>alert</span><span class="pun">(</span><span class="pln">cumulative</span><span class="pun">);</span><span class="pln"> &nbsp;</span><span class="com">// output the result</span></pre>
    <button id="execute-beta" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" role="button" aria-disabled="false"><span class="ui-button-icon-primary ui-icon ui-icon-wrench"></span><span class="ui-button-text">Execute</span></button>

    <h3 class="small">Plot a Normal distribution PDF:</h3>
    <pre class="prettyprint lang-js"><span class="com">// generate 100 points betwen -5 and 5</span><span class="pln"><br></span><span class="kwd">var</span><span class="pln"> range </span><span class="pun">=</span><span class="pln"> jstat</span><span class="pun">.</span><span class="pln">seq</span><span class="pun">(-</span><span class="lit">5</span><span class="pun">,</span><span class="lit">5</span><span class="pun">,</span><span class="lit">100</span><span class="pun">);</span><span class="pln"><br></span><span class="com">// calculate the densities at each point</span><span class="pln"><br></span><span class="kwd">var</span><span class="pln"> densities </span><span class="pun">=</span><span class="pln"> jstat</span><span class="pun">.</span><span class="pln">dnorm</span><span class="pun">(</span><span class="pln">range</span><span class="pun">,</span><span class="pln"> </span><span class="lit">0.0</span><span class="pun">,</span><span class="pln"> </span><span class="lit">1.0</span><span class="pun">);</span><span class="pln"><br></span><span class="com">// produce the plot (no formatting)</span><span class="pln"><br>jstat</span><span class="pun">.</span><span class="pln">plot</span><span class="pun">(</span><span class="pln">range</span><span class="pun">,</span><span class="pln"> densities</span><span class="pun">);</span></pre>
    <button id="execute-plot" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" role="button" aria-disabled="false"><span class="ui-button-icon-primary ui-icon ui-icon-wrench"></span><span class="ui-button-text">Execute</span></button>
    
</div>
<div class="grid_5">
    <h3>Get the latest version:</h3>
    <div class="info_box rounded shadow">
    <a href="http://github.com/jstat/jstat" title="Contribute to jStat on github!"><img style="position: absolute; top: -10px; right: -10px; border: 0;" src="./jStat_files/687474703a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677261795f3664366436642e706e67" alt="Fork me on GitHub"></a>
    <!-- quick download -->
    <p>
	Choose your download:
    </p>
    <p>
	<input type="radio" name="download-choice" id="production" checked="checked"><label for="production">Production (<em><strong>40KB</strong>, Minified</em>)</label><br>
	<input type="radio" name="download-choice" id="development"><label for="development">Development (<em><strong>80KB</strong>, Uncompressed code</em>)</label><br>
	<input type="radio" name="download-choice" id="bundle"><label for="bundle">Bundle (<em><strong>125KB</strong>, Zipped with dependencies</em>)</label>
    </p>
    <p class="info">
	The bundle contains all <strong>jStat</strong> dependencies and the <a href="https://github.com/taitems/Aristo-jQuery-UI-Theme" class="body">Aristo</a> jQuery theme.
    </p>
    <button id="download" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" role="button" aria-disabled="false"><span class="ui-button-icon-primary ui-icon ui-icon-disk"></span><span class="ui-button-text">download</span></button>
    <p class="info-inline">
	Current release: <span class="red">v1.0.0</span>
    </p>
</div>    <h3>Latest news:</h3>
    <div id="twitter-loading" style="display: none;">
	<h3>Loading feeds...</h3>
	<img alt="Loading latest twitter feeds" src="./jStat_files/loading.gif">
</div>
<div id="twitter-feed" style="display: block;">
	<!--
	<div id="twitter-icon">
	<a href=""><img alt="Follow us on twitter" src="images/icons/twitter.png" /></a>
	</div>
	-->
	<div id="twitter-data">
	<div class="tweet-container">   <div class="date">    <a href="http://twitter.com/#!/jstatdev">     <span class="day">      2      </span>     <span class="month">      /20     </span>    </a>   </div>   <div class="feed">    <p>      Visit <a class="body" a="" href="http://t.co/BRErTDIr">http://t.co/BRErTDIr</a> for the latest documentation.    </p>   </div>  </div><div class="tweet-container">   <div class="date">    <a href="http://twitter.com/#!/jstatdev">     <span class="day">      1      </span>     <span class="month">      /20     </span>    </a>   </div>   <div class="feed">    <p>      Official documentation template has been merged. Just run "make doc".    </p>   </div>  </div><div class="tweet-container">   <div class="date">    <a href="http://twitter.com/#!/jstatdev">     <span class="day">      1      </span>     <span class="month">      /20     </span>    </a>   </div>   <div class="feed">    <p>      Merged flot branch to master. Now have basic flot graphing support. Check test/flot.html for examples.    </p>   </div>  </div><div class="tweet-container">   <div class="date">    <a href="http://twitter.com/#!/jstatdev">     <span class="day">      1      </span>     <span class="month">      /20     </span>    </a>   </div>   <div class="feed">    <p>      Working on an optimisation package for jStat. Hoping to add it to the repo soon. Watch this space.    </p>   </div>  </div><div class="tweet-container">   <div class="date">    <a href="http://twitter.com/#!/jstatdev">     <span class="day">       0     </span>     <span class="month">      201     </span>    </a>   </div>   <div class="feed">    <p>      Sorry for the lack of updates, we disabled the github integration. Work is progressing well, hoping to update the website soon.    </p>   </div>  </div></div>
</div>

<script id="twitter-template" type="text/x-jquery-tmpl">
	<div class="tweet-container">
		<div class="date">
			<a href="http://twitter.com/#!/jstatdev">
				<span class="day">
	    ${day}
				</span>
				<span class="month">
	    ${month}
				</span>
			</a>
		</div>
		<div class="feed">
			<p>
	    {{html text}}
			</p>
		</div>
	</div>
</script>
    <div id="examples">
        <h3>Screenshots:</h3>
        <img id="beta-screenshot" src="./jStat_files/beta-distribution.jpg" alt="Beta distribution using jStat">
        <img id="t-screenshot" src="./jStat_files/student-t-distribution.jpg" alt="Student T distribution using jStat">
    </div>
</div>
                </div>

            </div>
        </div>
        <div id="footer">
            <div class="container_12">
                <p class="center">
                    <strong>jStat</strong> has received funding from the <a class="body" href="http://cordis.europa.eu/fp7/home_en.html">European Community's Seventh Framework Programme</a> (FP7/2007-2013) under grant agreement n° [248488].
                    <br>It was developed as part of the <a class="body" href="http://www.uncertweb.org/">UncertWeb - uncertainty-enabled model web</a> project.
                    <br>
                    <br><img src="./jStat_files/email_link.png" alt="contact jStat"> <a class="body" href="mailto:contact@jstat.org">contact@jstat.org</a>
                </p>
                <p>

                </p>
            </div>
        </div>


    

</body></html>