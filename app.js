document.addEventListener("DOMContentLoaded", function (){
	const view = document.querySelector("#txt");
	let n = 0;
	const Skills = ["WEB Developer!","UI/UX Designer!","Logo Desiger!"];
	
	function add(l, i, callback) {
		setTimeout(() => {
			view.innerHTML += l;
			if (i === l.length - 1 && callback) callback();
		}, 90 * i);
	}
	
	function app() {
		const word = Skills[n % Skills.length];
		view.innerHTML = "";
		word.split("").forEach((char, i) => {
			add(char, i, () => {
				n++;
				setTimeout(app, 3000); // بعد ثانية من انتهاء الكلمة يبدأ اللي بعدها
			});
		});
	}

	app();
	const Cycles = document.querySelectorAll(".cycle");
	Cycles.forEach((C)=>{
  C.addEventListener("transitionend",(e)=>{
if(getComputedStyle(Cycles[0]).width=="150px"){
	document.querySelector('p[class="wa-txt special"]').style.display="block";
	}
	});
  C.addEventListener("transitionstart",(e)=>{
if(document.querySelector('p[class="wa-txt special"]').style.display=="block"){
	document.querySelector('p[class="wa-txt special"]').style.display="none";
	}
	});
	
	C.addEventListener("transitionend",(e)=>{
if(getComputedStyle(Cycles[1]).width=="150px"){
	document.querySelector('p[class="ghub-txt special"]').style.display="block";
	}
	});
  C.addEventListener("transitionstart",(e)=>{
if(document.querySelector('p[class="ghub-txt special"]').style.display=="block"){
	document.querySelector('p[class="ghub-txt special"]').style.display="none";
	}
	});
	});
	document.querySelector('p[class="ghub-txt special"]').addEventListener("click",()=>{
		window.open("https://github.com/Zezo-Foad/","_blank");
	});
	document.querySelector('p[class="wa-txt special"]').addEventListener("click",()=>{
		window.open("https://wa.me/201116678396?text=Hi%20Zyad%2C%20I%20saw%20your%20portfolio%20and%20wanted%20to%20Talk!","_blank");
	});
});
