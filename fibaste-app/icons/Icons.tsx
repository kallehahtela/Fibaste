import { MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import colors from "@utils/colors";

const HomeRepairs = () => {
  return (
    <MaterialIcons name="home-repair-service" size={24} color={colors.primary} />
  );
};

const CleaningServices = () => {
  return (
    <MaterialIcons name="cleaning-services" size={24} color={colors.primary} />
  );
};

const DeliveryAndErrands = () => {
  return (
    <MaterialIcons name="delivery-dining" size={24} color={colors.primary} />
  );
};

const PetCare = () => {
  return (
    <MaterialIcons name="pets" size={24} color={colors.primary} />
  );
};

const TutoringAndLessons = () => {
  return (
    <FontAwesome5 name="chalkboard-teacher" size={24} color={colors.primary} />
  );
};

const EventHelp = () => {
  return (
    <MaterialIcons name="event" size={24} color={colors.primary} />
  );
};

const GardeningAndLandscaping = () => {
  return (
    <MaterialCommunityIcons name="flower" size={24} color={colors.primary} />
  );
};

const MovingAndPacking = () => {
  return (
    <FontAwesome5 name="truck-moving" size={24} color={colors.primary} />
  );
};

const PersonalAssistance = () => {
  return (
    <FontAwesome5 name="hands-helping" size={24} color={colors.primary} />
  );
};

const TechSupport = () => {
  return (
    <MaterialIcons name="support-agent" size={24} color={colors.primary} />
  );
};

const Icon = {
    HomeRepairs,
    CleaningServices,
    DeliveryAndErrands,
    PetCare,
    TutoringAndLessons,
    EventHelp,
    GardeningAndLandscaping,
    MovingAndPacking,
    PersonalAssistance,
    TechSupport,
};

export default Icon;