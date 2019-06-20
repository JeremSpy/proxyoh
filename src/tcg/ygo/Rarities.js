define([], function()
{
	var path = ["res", "tcg", "ygo", "foil"].join("/");
	return {
		common:     { name: "Common", foil: undefined, color: undefined },
		rare:       { name: "Rare", foil: undefined, color: "silver"},
		secret: { name: "Secret rare", foil: [ path, "Secret.png" ].join("/"), color: "silver" }
	};
});
