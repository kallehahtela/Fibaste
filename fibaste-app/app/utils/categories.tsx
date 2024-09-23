import Icon from "icons/Icons";

const categories = [
    { name: "Home Repairs", icon: <Icon.HomeRepairs /> },
    { name: "Cleaning Services", icon: <Icon.CleaningServices /> },
    { name: "Delivery & Errands", icon: <Icon.DeliveryAndErrands /> },
    { name: "Pet Care", icon: <Icon.PetCare /> },
    { name: "Tutoring & Lessons", icon: <Icon.TutoringAndLessons /> },
    { name: "Event Help", icon: <Icon.EventHelp /> },
    { name: "Gardening & Landscaping", icon: <Icon.GardeningAndLandscaping /> },
    { name: "Moving & Packing", icon: <Icon.MovingAndPacking /> },
    { name: "Personal Assistance", icon: <Icon.PersonalAssistance /> },
    { name: "Tech Support", icon: <Icon.TechSupport /> },
];

export default categories.sort();