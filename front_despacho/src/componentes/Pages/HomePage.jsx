import { DashboardStats } from "../Layouts/DashboardStats";
import { PruebaCards } from "../CrudAdmin/PruebaCards";
import Reviews from "../Layouts/Reviews";

export const HomePage = () => {
  return (
    <>
      <DashboardStats />
      <PruebaCards />
      <Reviews />
    </>
  );
};
