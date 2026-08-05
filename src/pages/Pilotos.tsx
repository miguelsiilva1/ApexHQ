import { mockTeams } from '../data/mockData';
import { useTranslation } from 'react-i18next';

const Pilotos = () => {
  const { t } = useTranslation();
  return (

    <div className = {styles.container}>
      {/* Header */}
      <div className = {styles.page_header}>
        <h1 className = {styles.page_title}>
          {t('drivers.title')}
        </h1>
        <p className = {styles.page_subtitle}>
          {t('drivers.subtitle')}
        </p>
      </div>

      {/* Teams */}
      <div className = {styles.grid}>
        {mockTeams.map((team) => (
          <div key={team.id} className = {styles.card}>
            
            {/* Team Header */}
            <div className = {styles.card_header}>
              <h2 className = {styles.team_name}>
                {team.name}
              </h2>
              <img 
                src = {team.logo} 
                alt = {`${team.name} Logo`} 
                className = {styles.team_logo}/>
            </div>

            <div className = {styles.card_body}>

              {/* Drivers */}
              <div className = {styles.drivers_row}>
                {team.drivers.map((driver) => (
                  <div key={driver.id} className = {styles.driver_container}>

                    {/* Driver Image */}
                    <div className = {styles.driver_image_wrapper}>
                      <img 
                        src = {driver.image} 
                        alt = {driver.name} 
                        className = {styles.driver_image}
                      />
                    </div>
                    
                    {/* Details */}
                    <div className = {styles.driver_number_back}>
                      {driver.number}
                    </div>
                    <h3 className = {styles.driver_name}>
                      {driver.name.split(' ')[0]} <br/>
                      <span className = "text-f1-red uppercase"> {driver.name.split(' ')[1]}</span>
                    </h3>
                    <span className = {styles.driver_number_badge}>
                      {driver.number}
                    </span>
                  </div>
                ))}
              </div>

              {/* Car */}
              <div className = {styles.car_wrapper}>
                <img 
                  src = {team.car_image} 
                  alt = {`${team.name} Car`} 
                  className = {styles.car_image}
                />
              </div>
            </div>
            
            <div className = "h-12 md:h-16"></div>
          </div>
        ))}
      </div>
    </div>
  );
};


const styles = {
  container: "p-6 space-y-8 pb-20",
  page_header: "mb-10 border-l-4 border-f1-red pl-4",
  page_title: "font-orbitron text-4xl md:text-5xl font-bold text-white uppercase",
  page_subtitle: "text-f1-light-gray mt-2 font-inter text-lg",
  
  grid: "grid grid-cols-1 lg:grid-cols-2 gap-8",
  
  card: "bg-[#15151e] rounded-xl border border-white/10 overflow-hidden hover:border-f1-red/50 transition-all duration-300 group",
  card_header: "bg-white/5 p-4 flex items-center justify-between border-b border-white/5",
  card_body: "p-6 relative",
  
  team_name: "font-orbitron text-xl md:text-2xl font-bold text-white uppercase tracking-wider",
  team_logo: "h-8 md:h-10 object-contain opacity-80 group-hover:opacity-100 transition-opacity",
  
  drivers_row: "flex justify-around items-end mb-12 relative z-10",
  driver_container: "text-center flex flex-col items-center",
  driver_image_wrapper: "relative w-24 h-24 md:w-32 md:h-32 mb-2 rounded-full overflow-hidden border-2 border-transparent group-hover:border-f1-red transition-all bg-gradient-to-b from-white/10 to-transparent",
  driver_image: "w-full h-full object-cover object-top pt-2",
  driver_number_back: "font-orbitron font-bold text-2xl text-white/10 absolute top-0 -z-10 scale-150",
  driver_name: "font-bold text-white text-lg leading-none",
  driver_number_badge: "text-xs font-bold bg-white/10 px-2 py-0.5 rounded mt-1 text-gray-400",
  
  car_wrapper: "absolute -bottom-4 left-0 right-0 flex justify-center pointer-events-none",
  car_image: "w-[90%] md:w-[80%] object-contain transform group-hover:scale-105 group-hover:-translate-y-2 transition-transform duration-500 ease-out",
};

export default Pilotos;