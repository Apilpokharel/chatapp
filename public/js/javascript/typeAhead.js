


function searchResultHTML(result){
	return result.map(function(product){
		return `
		<a href="/infocart/${product._id}" class="search__result" style="padding-left: 10px; padding-top: 10px; ">
             <strong style=" padding: 8px; color: black;">${product.text}</strong>
		</a><br>`;
	}).join('');
}

function typeAhead(search){
	

	if(!search) return;

	const searchInput = search.querySelector('input[name="search"]');
	const searchResults = search.querySelector('.search_result');

	// console.log(searchInput, searchResults);
	searchInput.on('input', function(){
		// console.log(this.value);

		// if there is no value quit search
		if(!this.value){
			searchResults.style.display = 'none';
			return;
		}

		searchResults.style.display = 'block';

		searchResults.innerHTML = '';

		axios 
		.get(`/api/search/v1?search=${this.value}`)
		.then(function(res){
			if(res.data.length){
			// console.log("there is something");	
			const html = searchResultHTML(res.data);
			console.log(html);

			searchResults.innerHTML = DOMPurify.sanitize(html);
              return;
			}
			searchResults.innerHTML =  DOMPurify.sanitize(`<div class="search_result">No result for ${this.value} found!</div>`);
			console.log(res.data);
		}).catch(function(err){
			res.status(404).send('error catched');
		})
	});

	// handel keyboard inputs

	searchInput.on('keyup', function(e){
		//if they arent pressing the keyword
// console.log(e);
e.preventDefault();
		if(![38, 40, 13].includes(e.keyCode)){
			return;
		}
		console.log('do something');
		const activeClass = 'search__result__active';
		const current = search.querySelector(`.${activeClass}`);
		const items = search.querySelectorAll('.search__result');

		let next;
		if(e.keyCode === 48 && current){
			next = current.nextElementSiblings || items[0];
		}
		else if(e.keyCode === 40){
              next = items[0];
		}

		else if(e.keyCode === 38 && current){
			next = current.previousElementSiblings || items[items.length -1]
		}
		else if(e.keyCode === 38){
			next = items[items.length -1];
		}
		else if(e.keyCode === 13 && current.href){
			window.location = current.href;
			return;
		}


if(current){
	current.classList.remove(activeClass);
}

next.classList.add(activeClass);
console.log(next);
	});
};




typeAhead($('.search'));