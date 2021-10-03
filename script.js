var Links,
	i = 0,
	j = 0;
var link = "links";
var aLinks = [];
var ilinks = document.querySelectorAll("h3 a");
for (let x of ilinks) {
	aLinks.push(x);
}
(async () => {
	while (link) {
		link = document.querySelector("#see_older_threads a");
		console.log(link);
		if (!link) {
			console.log("All messages deleted sucesfully!", i++);
			break;
		}
		link = link.href;
		await new Promise((resolve) => {
			$.get(link, function (html) {
				Links = $("h3 a", html);
				link = $("#see_older_threads a", html).get(0).href;
				document.querySelector("#see_older_threads a").href = link;
			}).done(function () {
				$.each(Links, function (index, value) {
					aLinks.push(value);
				});
				resolve();
			});
		});
		i++;
	}
	console.log(aLinks);

	for (i = 0; i < aLinks.length; ++i) {
		let currentLink = aLinks[i];
		currentLink.style.color =
			currentLink.style.color == "black" ? "red" : "green";

		$.get(currentLink.href, function (data) {
			getPayload1(currentLink.href).then((payLoad) => {
				let abLink = currentLink.href;
				let deleteApiLink = abLink.split("?").pop().split("&");
				deleteApiLink.splice(1, 0, `tids=${deleteApiLink[0].split("=").pop()}`);
				deleteApiLink = deleteApiLink.join("&").split("#").shift();
				const apiLink =
					`https://mbasic.facebook.com/messages/action_redirect?` +
					deleteApiLink;

				$.post(apiLink, payLoad).done(function (data) {
					let mydeletehref = findInParsed(data, "a:contains('Delete')");
					const username = currentLink.innerText;
					const deleteLink = mydeletehref.href;
					insertDeleteLinkInUser(username, deleteLink);
				});
			});
		});
	}
})();
function getPayload1(link) {
	return new Promise((resp) => {
		$.get(link, function (html1) {
			let fbDtsg = findInParsed(html1, "input[name='fb_dtsg']");
			let jazoest = findInParsed(html1, "input[name='jazoest']");
			resp({
				fb_dtsg: fbDtsg.value,
				jazoest: jazoest.value,
				delete: "Delete",
			});
		});
	});
}
function findInParsed(html, selector) {
	return $(selector, html).get(0) || $(html).filter(selector).get(0);
}
function getOlderMessagesLink(html = false) {
	if (html) {
		return $("#see_older_threads").find("a").get(0).href;
	}
	let selector = "#see_older_threads";
	return (
		$(selector, html).find("a").get(0).href ||
		$(html).filter(selector).find("a").get(0).href
	);
}
function insertDeleteLinkInUser(username, link) {
	$("a:contains('" + username + "')")
		.parent()
		.parent()
		.parent()
		.prepend(
			'<a href="' +
				link +
				'" style="color:red; padding:5px;" target="_blank">DELETE ME</a>'
		);
	$.get(link, function (html) {
		console.log(username);
	});
}
