const AMENITIES = {
    Sustenance: ["bar","biergarten","cafe","fast_food","food_court","ice_cream","pub","restaurant"],
    Education: ["college","driving_school","kindergarten","language_school","library","toy_library","training","music_school","school","university"],
    Entertainment: ["arts_centre","casino","cinema","community_centre","conference_centre","events_venue","fountain","planetarium","public_bookcase","social_centre","studio","theatre"]
}

const TOURISM = {
    Tourism: ["aquarium","artwork","attraction","gallery","gallery","information","museum","picnic_site","theme_park","viewpoint","zoo"],
    Accomodation: ["alpine_hut","apartment","camp_pitch","camp_site","caravan_site","chalet","guest_house","hostel","hotel","motel","wilderness_hut"]
}

const INTERESTS = new Set([...Object.keys(AMENITIES), ...Object.keys(TOURISM)]);

const PLACES = ["city","town","village","hamlet"];

module.exports = { AMENITIES, TOURISM, INTERESTS, PLACES }