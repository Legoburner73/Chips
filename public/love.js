
var 
  salutations1 = ["Beloved", "Dear", "Dearest", "Beautiful", "Sweetheart"],
    
  salutations2 = ["Vy"],

  adverbs = ["AFFECTIONATELY", "ARDENTLY", "ANXIOUSLY", "BEAUTIFULLY", 
             "BURNINGLY", "COVETOUSLY", "CURIOUSLY", "EAGERLY", "FERVENTLY", 
             "FONDLY", "IMPATIENTLY", "KEENLY", "LOVINGLY", "PASSIONATELY", 
             "SEDUCTIVELY", "TENDERLY", "WISTFULLY", ""].map(e=>e.toLowerCase()),

  adjectives = ["AFFECTIONATE", "AMOROUS", "ANXIOUS", "AVID", "BEAUTIFUL", 
                "BREATHLESS", "BURNING", "COVETOUS", "CRAVING", "CURIOUS", 
                "EAGER", "FERVENT", "FONDEST", "LOVEABLE", "LOVESICK", 
                "LOVING", "PASSIONATE", "PRECIOUS", "SEDUCTIVE", "SWEET", 
                "SYMPATHETIC", "TENDER", "UNSATISFIED", "WINNING", "WISTFUL", ""].map(e=>e.toLowerCase()),

  nouns = ["ADORATION", "AFFECTION", "AMBITION", "APPETITE", "ARDOUR", "BEING",
           "BURNING", "CHARM", "CRAVING", "DESIRE", "DEVOTION", "EAGERNESS", 
           "ENCHANTMENT", "ENTHUSIASM", "FANCY", "FELLOW FEELING", "FERVOUR", 
           "FONDNESS", "HEART", "HUNGER", "INFATUATION", "LITTLE LIKING",
           "LONGING", "LOVE", "LUST", "PASSION", "RAPTURE", "SYMPATHY", 
           "THIRST", "WISH", "YEARNING"].map(e=>e.toLowerCase()),

  verbs = ["ADORES", "ATTRACTS", "CLINGS TO", "HOLDS DEAR", "HOPES FOR", 
           "HUNGERS FOR", "LIKES", "LONGS FOR", "LOVES", "LUSTS AFTER", 
           "PANTS FOR", "PINES FOR", "SIGHS FOR", "TEMPTS", "THIRSTS FOR",
           "TREASURES", "YEARNS FOR", "WOOS"].map(e=>e.toLowerCase());

function choose(lst){
  var i = Math.floor(Math.random()*lst.length);
  return lst[i];
}

var msg = document.body;

msg.innerHTML = choose(salutations1) + " " + choose(salutations2) + "," + "<p>";

for (var i = 0; i < 5; i = i + 1){
  if (Math.random() < 0.5){
     msg.innerHTML += "My " + 
                      choose(adjectives) + " " + 
                      choose(nouns) + " " + choose(adverbs) + " " + 
                      choose(verbs) +  " your " + 
                      choose(adjectives) + " " + choose(nouns) + ". "; 
  }
  else{
     msg.innerHTML += "You are my " + 
                      choose(adjectives) + " " + choose(nouns) + ". ";
  }
}

msg.innerHTML += "<p>Yours" + ",<p>Willy";

