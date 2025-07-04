import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PEOPLE = [
  "Шевченко Андрій Олександрович",
  "Коваль Іван Сергійович",
  "Мельник Юрій Васильович",
  "Ткаченко Олег Миколайович",
  "Кравчук Дмитро Ігорович",
  "Бондар Артем Андрійович",
  "Лисенко Олексій Романович",
  "Савченко Назар Павлович",
  "Петренко Віталій Артемович",
  "Захарченко Богдан Володимирович",
  "Гриценко Максим Михайлович",
  "Олійник Тараз Степанович",
  "Романюк Владислав Євгенович",
  "Дяченко Марко Богданович",
  "Ніколайчук Роман Ілліч",
  "Яценко Віктор Петрович",
  "Кирилюк Степан Данилович"
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredPeople = PEOPLE.filter(person =>
    person.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePersonClick = (person: string) => {
    navigate(`/edit/${encodeURIComponent(person)}`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search and List Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Input
                type="text"
                placeholder="Пошук..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 text-lg border-2 border-border focus:border-primary"
              />
            </div>
            
            <Card className="p-6 bg-card border-border">
              <div className="space-y-2">
                {filteredPeople.map((person, index) => (
                  <div
                    key={index}
                    onClick={() => handlePersonClick(person)}
                    className="flex items-center p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  >
                    <span className="text-foreground font-medium mr-3">
                      {index + 1}.
                    </span>
                    <span className="text-foreground">{person}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            <Card className="p-8 bg-primary text-primary-foreground">
              <h2 className="text-2xl font-bold text-center leading-tight">
                ЗОНА ДЛЯ
                <br />
                МАЙБУТНІХ
                <br />
                ПАЛЄЗНИХ
                <br />
                КНИПОК
              </h2>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;