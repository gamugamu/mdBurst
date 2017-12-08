var converter = new showdown.Converter({tables: true, ghCompatibleHeaderId: true, simpleLineBreaks: true, emoji:true});

// Note impossible de trouver une libre pour générer des tocs. Je l'ai donc écrites moi même.
// TOC generator
function cv_parseMdForToc(text) {
  if (text.includes("[toc]")){
    var lines         = text.split('\n');
    var generated_toc = "<ul>"

    for (var i = 0; i < lines.length; i++) {
      var count = (lines[i].match(/#/g) || []).length;

      if (count > 0){
        generated_toc += '<li> <a href="#titre-de-niveau-2">' + lines[i].replace(/#/g, '') + '</a></li>'
      }
    }
    generated_toc += "</ul>"
    return text.replace("[toc]", generated_toc)

  }else{
    // pas de toc, pas de modif
    return text;
  }
}

function cv_parseMdForImage(text, image_base_64) {
  if (text.includes("data:image_")){
    var rx = /data:image_[^]/g
    text   = text.replace(rx,
              function($0,$1){
                $0 = $0.replace("data:image_", "")
                var idx = parseInt($0)
                return '<img id="blah" src="' + image_base_64[idx] + '" alt="your image" />'
              });

    return text

  }else{
    // pas de toc, pas de modif
    return text;
  }
}

// transformation en md
function cv_convert_showdown(text, image_base_64) {
    text = cv_parseMdForToc(text)
    text = cv_parseMdForImage(text, image_base_64)
    return converter.makeHtml(text);
};
