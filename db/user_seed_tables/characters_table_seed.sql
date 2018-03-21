create table if not exists characters (
    id serial primary key,
    user_id integer not null references users(id),
    name varchar(180),
    image text,
    race varchar(20),
    class varchar(20),
    level integer default 1,
    experience_points integer,
    background varchar(20),
    alignment varchar(20),
    strength integer,
    dexterity integer,
    constitution integer,
    intelligence integer,
    wisdom integer,
    charisma integer,
    inspiration integer,
    proficiency_bonus integer,
    strength_saving_throw boolean default false,
    dexterity_saving_throw boolean default false,
    constitution_saving_throw boolean default false,
    intelligence_saving_throw boolean default false,
    wisdom_saving_throw boolean default false,
    charisma_saving_throw boolean default false,
    acrobatics boolean default false,
    animal_handling boolean default false,
    arcana boolean default false,
    athletics boolean default false,
    deception boolean default false,
    history boolean default false,
    insight boolean default false,
    intimidation boolean default false,
    investigation boolean default false,
    medicine boolean default false,
    nature boolean default false,
    perception boolean default false,
    performance boolean default false,
    persuasion boolean default false,
    religion boolean default false,
    sleight_of_hand boolean default false,
    stealth boolean default false,
    survival boolean default false,
    languages varchar(180),
    other_proficiencies varchar(180),
    armor_class integer,
    initiative integer,
    speed integer,
    max_hit_points integer,
    current_hit_points integer,
    temp_hit_points integer,
    total_hit_dice varchar(10),
    current_hit_dice integer,
    death_save_successes integer default 0,
    death_save_failures integer default 0,
    personality_traits varchar(180),
    ideals varchar(180),
    bonds varchar(180),
    flaws varchar(180),
    platinum integer,
    gold integer,
    electrum integer,
    silver integer,
    copper integer,
    features varchar(180),
    traits varchar(180) 
);
