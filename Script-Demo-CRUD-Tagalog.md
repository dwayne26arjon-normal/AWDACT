# Final Video Script: Portfolio CRUD with Validation

## Bago mag-record — gabay lang, hindi babasahin

1. Sa VS Code, buksan ang `C:\Users\dwaynedee\Desktop\AWDACT\laravel-app`.
2. Sa terminal, patakbuhin ang `composer run dev` at iwanang bukas ito.
3. Sa browser, ihanda ang dalawang tab:
   - Public portfolio: `http://127.0.0.1:8000/`
   - Admin projects: `http://127.0.0.1:8000/admin/projects`
4. Maghanda ng sample project na gagamitin sa CRUD. Huwag mag-delete ng project na gusto mong panatilihin.
5. Siguraduhing wala pang Difficulty sa code; idaragdag ito sa live change.
6. Huwag patakbuhin ang `php artisan migrate:fresh` at huwag tanggalin ang timestamp sa migration filename.

Sa mismong recording, sundin ang anim na bahagi sa ibaba ayon sa pagkakasunod na hinihingi ng activity PDF. Yung **Gagawin** ay instructions lang. Yung nasa ilalim ng **Sasabihin** ang puwede mong sabihin; okay lang baguhin nang kaunti para natural.

---

## 1. Introduction

**Gagawin:** Iwan sa browser ang homepage at ipakita nang mabilis ang portfolio at Projects section.

**Sasabihin:**

> “Hi, ako si [pangalan mo] from [course at section]. Ipapakita ko yung portfolio ko para sa midterm activity. Yung Projects section yung pinili kong gawing dynamic kasi dito ko gustong i-manage yung mga project na nagawa ko. Imbes na baguhin ko yung code kada may bago, puwede na akong mag-add, mag-edit, at mag-delete gamit yung admin page.”

---

## 2. Folder Structure

**Gagawin:** Lumipat sa VS Code. Sa Explorer, ipakita ang mga folder at file na ito. Hindi kailangang buksan o basahin lahat; ituro lang kung saan matatagpuan.

1. `database\migrations` — project table at mga pagbabago sa table. Main project migration: lines 12–27; completed-date migration: lines 12–26.
2. `app\Models\Project.php` — Project model, lines 7–26; `$fillable`, lines 9–21.
3. `app\Http\Controllers\ProjectController.php` — CRUD controller, lines 14–53.
4. `app\Http\Requests\StoreProjectRequest.php` at `UpdateProjectRequest.php` — validation. Rules: Store lines 14–29 at Update lines 14–31; custom messages: Store lines 31–38 at Update lines 33–40.
5. `routes\web.php` — URLs/routes, lines 7–20.
6. `resources\js\Pages\Admin\Projects` — admin pages: Index lines 3–74, Create lines 4–37, Edit lines 4–37.
7. `resources\js\Pages\Portfolio\Index.jsx` — public portfolio page; project display bandang lines 292–350.
8. `resources\js\Components\ProjectForm.jsx` — reusable form, lines 3–181.

**Sasabihin:**

> “Ito yung mga main files na ginamit ko. Nasa migrations yung database structure, nasa model yung project fields, at nasa controller yung CRUD actions. Yung routes ang nag-uugnay ng URL sa controller. Sa React naman, nasa Pages yung mga screen at nasa Components yung form na ginagamit sa add at edit.”

---

## 3. Code Explanation

Sundin ang flow na nasa activity: **Route → Controller → Validation → Model → Inertia → React Page**.

### Route

**Gagawin:** Buksan ang `routes\web.php`. Ipakita ang public route sa line 7 at admin project routes sa lines 9–16.

**Sasabihin:**

> “Una, dito sa `web.php` nakalista yung URLs. Halimbawa, yung `/admin/projects` para sa list, at may routes din para gumawa, mag-edit, mag-update, at mag-delete.”

### Controller

**Gagawin:** Buksan ang `app\Http\Controllers\ProjectController.php`. Hanapin ang `index` lines 14–19, `create` lines 22–25, `store` lines 27–32, `edit` lines 34–39, `update` lines 41–46, at `destroy` lines 48–53.

**Sasabihin:**

> “Pag tinawag yung route, papasok siya sa tamang method dito sa controller. Halimbawa, `store` yung nagse-save ng bagong project, at `update` naman yung nagsa-save ng mga binago.”

### Validation

**Gagawin:** Buksan ang `app\Http\Requests\StoreProjectRequest.php` at `UpdateProjectRequest.php`. Ipakita ang Store `rules()` lines 14–29 at `messages()` lines 31–38; sa Update, `rules()` lines 14–31 at `messages()` lines 33–40.

**Sasabihin:**

> “Bago tumakbo yung pag-save, chine-check muna ni Laravel yung input gamit yung Form Request. May rules para sa required fields, haba at format ng values, at para hindi duplicate yung slug.”

### Model

**Gagawin:** Buksan ang `app\Models\Project.php`, ipakita ang `$fillable` lines 9–21. Pagkatapos, puwede mong ipakita ang `database\migrations\2026_11_02_070137_create_projects_table.php`, lines 12–27.

**Sasabihin:**

> “Kapag valid yung input, yung Project model yung ginagamit para magbasa o mag-save sa database. Sa `$fillable` nakalista yung fields na pinapayagan kong maisama sa pag-save. Nasa migration naman yung columns ng projects table.”

### Inertia

**Gagawin:** Sa `ProjectController.php`, ipakita ang `Inertia::render(...)` sa `index()` lines 14–19, `create()` lines 22–25, at `edit()` lines 34–39. Ituro na may ipinapasa itong project list, project record, o success message depende sa page. Para sa public page, buksan ang `app\Http\Controllers\PortfolioController.php`, lines 11–16.

**Sasabihin:**

> “Dito ginagamit yung Inertia para ibigay sa React yung page na kailangan at yung data nito. Halimbawa, sa list ipinapasa yung projects, at sa edit ipinapasa yung project na babaguhin.”

### React Page at reusable form

**Gagawin:** Buksan ang:

1. `resources\js\Pages\Admin\Projects\Index.jsx`, lines 3–74.
2. `resources\js\Pages\Admin\Projects\Create.jsx`, lines 4–37.
3. `resources\js\Pages\Admin\Projects\Edit.jsx`, lines 4–37.
4. `resources\js\Components\ProjectForm.jsx`, lines 3–181.

Sa `ProjectForm.jsx`, ipakita ang default values lines 3–15, `useForm` lines 17–24, submit function lines 26–35, at fields lines 38–178.

**Sasabihin:**

> “Pagdating sa React, yung Inertia page ang nagpapakita ng tamang screen. Hiwalay yung list, create, at edit pages. Pero iisang `ProjectForm` lang yung ginagamit sa create at edit para hindi ko ulit-ulitin yung parehong form.”

### Mga tanong na maaaring itanong tungkol sa code

**Bakit hiwalay ang controller at hindi lahat nasa `web.php`?**

**File/line na ipapakita:** `routes\web.php`, lines 9–16; `ProjectController.php`, lines 14–53.

> “Para mas maayos at madaling hanapin yung CRUD logic. Routes lang yung nasa `web.php`; yung mismong actions nasa controller.”

**Anong routes ang gagawin ng `Route::resource()`, at alin ang gamit ng project na ito?**

**File/line na ipapakita:** `routes\web.php`, lines 9–16.

> “Ang `Route::resource()` ay gagawa ng index, create, store, show, edit, update, at destroy routes. Dito, explicit na nakalista yung routes. Ginagamit ko yung index, create, store, edit, update, at destroy para sa admin CRUD. Yung public portfolio ay hiwalay na route. Wala akong admin `show` route dahil sa list at public page tinitingnan yung project.”

**Ano ang mangyayari kung alisin ang `$fillable`?**

**File/line na ipapakita:** `app\Models\Project.php`, lines 9–21; halimbawa ng paggamit, `ProjectController.php`, lines 27–30 at 41–44.

> “Pinoprotektahan ng `$fillable` kung aling fields ang puwedeng isama sa mass assignment. Kapag wala o hindi kumpleto, hindi maisasama nang tama yung fields sa `create` o `update`; puwedeng mag-error depende sa Laravel settings.”

**Bakit sa Laravel ang validation at hindi sa React lang?**

**File/line na ipapakita:** `app\Http\Requests\StoreProjectRequest.php`, lines 14–29; `ProjectForm.jsx`, lines 26–35.

> “Puwedeng lampasan o baguhin ng user yung browser-side checks. Kaya sa Laravel pa rin dapat ang final validation bago i-save sa database.”

**Paano nakakarating ang Laravel errors sa React nang walang full page reload?**

**File/line na ipapakita:** `ProjectForm.jsx`, lines 48–155 para sa field errors; `Create.jsx`, lines 4 at 31; `Edit.jsx`, lines 4 at 31. Optional middleware reference: `HandleInertiaRequests.php`, lines 36–41.

> “Inertia yung nagpapadala ng form request sa background. Kapag may validation error, ibinabalik iyon ni Laravel at ipinapasa ng Inertia bilang page props. Tinatanggap ng Create o Edit page yung `errors` at ipinapasa sa ProjectForm, kung saan ipinapakita yung error katabi ng field.”

**Bakit reusable ang form?**

**File/line na ipapakita:** `ProjectForm.jsx`, lines 3–35; `Create.jsx`, lines 4 at 31; `Edit.jsx`, lines 4 at 31.

> “Pareho halos yung fields sa add at edit, kaya isang component na lang ang ginagamit. Mas kaunti yung inuulit na code at kapag may babaguhin sa form, isang lugar lang ang aayusin.”

---

## 4. CRUD Demo

### Create at view

**Gagawin sa browser:** Buksan ang `http://127.0.0.1:8000/admin/projects`, pindutin ang **Add project**, at punan ang form. Gumamit ng bagong title at unique slug; punan ang required fields. Pindutin ang **Create project**. (Code reference: `Index.jsx` lines 25–30 para sa Add button; `Create.jsx` line 31 para sa shared form; `ProjectForm.jsx` lines 26–35 para sa submit; `ProjectController.php` lines 27–32 para sa pag-save.)

**Sasabihin:**

> “Ngayon magdadagdag ako ng sample project. Kailangan unique yung slug, kaya gagamit ako ng bagong pangalan. Pag pinindot ko yung Create, iche-check muna yung input bago i-save.”

**Gagawin:** Ipakita ang bagong record sa admin list, tapos buksan ang public portfolio at hanapin ang project. (Code reference: `ProjectController.php` lines 14–19 para sa admin list; `PortfolioController.php` lines 11–16 para sa public projects; `Portfolio\Index.jsx` lines 292–323 para sa project details.)

**Sasabihin:**

> “Ayan, lumabas na siya sa admin list. Titingnan ko rin yung public page—nandito rin yung project na ginawa ko.”

### Edit

**Gagawin:** Bumalik sa admin list, pindutin ang **Edit** sa sample project, baguhin ang description, at pindutin ang **Update project**. Ipakita na nagbago sa list o public page. (Code reference: `Index.jsx` lines 55–58 para sa Edit link; `Edit.jsx` line 31 para sa shared form; `ProjectForm.jsx` lines 26–35 para sa submit; `ProjectController.php` lines 41–46 para sa update.)

**Sasabihin:**

> “I-e-edit ko naman yung description. Pagkatapos i-save, makikita yung updated na details dito sa list at sa public page.”

### Delete

**Gagawin:** Sa parehong sample project, pindutin ang **Delete** at piliin ang **OK** sa confirmation. Huwag mag-delete ng ibang project. (Code reference: `Index.jsx` lines 3–10 para sa confirmation; `Index.jsx` lines 59–62 para sa Delete button; `ProjectController.php` lines 48–53 para sa pag-delete.)

**Sasabihin:**

> “Pag nag-delete, may confirmation muna para hindi aksidenteng matanggal. Sample project lang ito, kaya iko-confirm ko. Ayan, wala na siya sa list.”

---

## 5. Validation Demo

**Gagawin sa browser:** Buksan ang **Add project**. Piliin yung **Empty form** test case sa validation test table mo: iwanang blanko ang required fields at pindutin ang **Create project**. Ipakita ang errors sa tabi ng fields. (Code reference: `ProjectForm.jsx` lines 38–48 para sa title input at error; `StoreProjectRequest.php` lines 17–24 para sa required rules.)

**Sasabihin:**

> “Susubukan ko naman kapag may kulang na input. Hindi dapat ma-save yung project, at makikita kung aling fields yung kailangan kong ayusin.”

**Gagawin:** Ipakita rin yung Empty form row sa validation test table mo, kasama ang expected at actual result. Sa VS Code, buksan ang `tests\Feature\ProjectValidationTest.php`: empty form lines 30–42, title length 44–52, slug format 54–64, invalid GitHub URL at retained input 66–80, duplicate slug 82–92, at update slug 94–101. Pagkatapos, buksan ang `StoreProjectRequest.php`, lines 14–29, para sa rules, at `ProjectForm.jsx`, lines 48, 59, 77, 88, 99, 110, 121, 133, 144, at 155, para sa error display.

**Sasabihin:**

> “Ito yung validation tests ko. Halimbawa, chine-check kung may kulang na required fields, sobrang haba ng title, maling format ng slug, invalid na GitHub URL, o duplicate na slug. Kapag may error, ipinapakita siya sa tabi ng field at hindi nase-save yung invalid na data.”

Kung kailangan ng pangalawang live example, maglagay ng invalid GitHub URL o gumamit ng slug na alam mong nagamit na. I-submit at ipakita yung error.

---

## 6. Live Change

**Gagawin:** Huwag ihinto o i-cut ang recording. Sa VS Code terminal, tiyaking nasa `laravel-app` folder ka. Idagdag ang Difficulty sa database, model, validation, at form; pagkatapos ay ipakita itong gumagana.

**Sasabihin:**

> “Para sa live change, magdadagdag ako ng Difficulty field. Gagawin ko yung migration, isasama sa model at validation, tapos magdadagdag ako ng dropdown sa form.”

### 1. Migration

**Gagawin sa terminal:**

```powershell
php artisan make:migration add_difficulty_to_projects_table --table=projects
```

**Gagawin sa VS Code:** Buksan ang bagong file sa `database\migrations`. Panatilihin ang timestamp sa filename. Sa loob ng kasalukuyang `up()` function, idagdag ang `Schema::table(...)` block sa ibaba. Huwag palitan o burahin yung buong migration file. Pagkatapos, sa loob ng `down()` function, idagdag ang rollback block. Dahil bagong file ito, maaaring mag-iba ang exact line numbers; gamitin ang **Ctrl+F** para hanapin ang `up()` at `down()`.

```php
// Idagdag sa loob ng up():
Schema::table('projects', function (Blueprint $table) {
    $table->string('difficulty')->default('Medium');
});

// Idagdag sa loob ng down():
Schema::table('projects', function (Blueprint $table) {
    $table->dropColumn('difficulty');
});
```

**Gagawin sa terminal:** I-save ang file at patakbuhin:

```powershell
php artisan migrate
```

**Sasabihin:**

> “Naidagdag na ng migration yung bagong column sa database. May default na Medium para may value yung mga existing project.”

### 2. Model

**Gagawin sa VS Code:** Sa `app\Models\Project.php`, pumunta sa `$fillable` lines 9–21 at idagdag ang `'difficulty',` pagkatapos ng `'category',`:

```php
'category',
'difficulty',
'excerpt',
```

**Sasabihin:**

> “Idinadagdag ko rin sa `$fillable` para maisama yung bagong field kapag nag-save ng project.”

### 3. Validation

**Gagawin sa VS Code:** Sa `rules()` ng `StoreProjectRequest.php` (kasalukuyang lines 14–29) at `UpdateProjectRequest.php` (lines 14–31), idagdag ang rule kaagad pagkatapos ng `category` rule. Gawin ito sa parehong files:

```php
'category' => ['required', 'string', 'in:Web Development,Creative,Web App,UI/UX,Branding,Mobile,Data'],
'difficulty' => ['required', 'string', 'in:Easy,Medium,Hard'],
'excerpt' => ['required', 'string', 'max:180'],
```

Huwag palitan yung ibang rules. Sa `StoreProjectRequest.php`, idagdag din sa `messages()` kung gusto mong may custom na error kapag invalid ang value; optional ito:

```php
'difficulty.in' => 'Choose Easy, Medium, or Hard for the project difficulty.',
```

**Sasabihin:**

> “Required yung Difficulty, at Easy, Medium, o Hard lang yung valid na value. Pareho yung rule sa pag-add at pag-edit.”

### 4. Form input

**Gagawin sa VS Code:** Sa `resources\js\Components\ProjectForm.jsx`, ikaw mismo ang maglalagay ng dalawang code sa ibaba. Kopyahin ang snippets at ilagay sa mga lokasyong nakasaad:

1. Sa `defaultValues` lines 3–15, idagdag ang linyang `difficulty: ''` pagkatapos ng `category`. Dapat ganito ang magkakasunod na lines:

   ```js
   category: 'Web Development',
   difficulty: '',
   excerpt: '',
   ```

2. Pagkatapos ng buong Category field (kasalukuyang lines 61–79), bago magsimula ang Tech stack field, kopyahin at idagdag itong buong bagong form field:

   ```jsx
   <div className="field">
       <label htmlFor="difficulty">Difficulty</label>
       <select
           id="difficulty"
           value={data.difficulty}
           onChange={(event) => setData('difficulty', event.target.value)}
       >
           <option value="">Select difficulty</option>
           <option value="Easy">Easy</option>
           <option value="Medium">Medium</option>
           <option value="Hard">Hard</option>
       </select>
       {errors.difficulty ? <span className="error-message">{errors.difficulty}</span> : null}
   </div>
   ```

   Kapag nag-e-edit ng existing project, kukunin ng form ang dating value mula sa `...(project ?? {})`; ang blankong default ay para sa bagong project para mapilitang pumili.

**Sasabihin:**

> “Naglagay ako ng dropdown sa shared form para magamit sa create at edit. Blank yung unang option para kailangan talagang pumili.”

### Ipakita sa admin list at public page

**Gagawin sa VS Code:** Ipakita rin yung value sa dalawang page:

1. Sa `resources\js\Pages\Admin\Projects\Index.jsx`, hanapin ang `<small>` na kasalukuyang nagpapakita ng category at Featured/Standard (bandang lines 46–53). Palitan lang yung laman ng `<small>` ng:

   ```jsx
   {project.category} • {project.difficulty} • {project.featured ? 'Featured' : 'Standard'}
   ```

2. Sa `resources\js\Pages\Portfolio\Index.jsx`, hanapin ang paragraph na nagpapakita ng completion date (bandang lines 292–323). Idagdag ang Difficulty span sa loob ng parehong `<p>`:

   ```jsx
   <p className="mt-3 flex flex-wrap items-center gap-3 text-sm text-mute">
       <span>Completed: {completedDate}</span>
       <span>Difficulty: {project.difficulty}</span>
   </p>
   ```

   Kung may ibang laman na sa paragraph sa file mo, idagdag lang yung bagong `<span>` at huwag burahin yung kasalukuyang content.

**Sasabihin:**

> “Idadagdag ko rin yung Difficulty sa admin list at public page para makita yung value pagkatapos i-save.”

### I-update ang validation tests

**Gagawin sa VS Code:** Dahil required na ang Difficulty, kailangang i-update ang test data para hindi bumagsak ang mga test na nagse-save ng valid project. Buksan ang `tests\Feature\ProjectValidationTest.php`:

1. Sa `test_empty_project_form_reports_required_field_errors()` (lines 30–42), idagdag ang `'difficulty'` sa listahan ng expected errors.
2. Sa `validProjectData()` (lines 103–116), idagdag ang `'difficulty' => 'Medium',` pagkatapos ng category.
3. Magdagdag ng test na nagpapatunay na hindi tinatanggap ang ibang value. Ilagay ito bago ang `private function validProjectData()`:

   ```php
   public function test_invalid_difficulty_is_rejected(): void
   {
       $this->from('/admin/projects/create')
           ->post('/admin/projects', [
               ...$this->validProjectData(),
               'difficulty' => 'Very hard',
           ])
           ->assertSessionHasErrors('difficulty');
   }
   ```

4. Sa terminal habang nasa `laravel-app` folder, patakbuhin:

   ```powershell
   php artisan test --filter=ProjectValidationTest
   ```

   Ipagpatuloy lang kapag test command successful na. Kung may failed test, basahin ang error at ayusin bago mag-demo.

### Ipakita na gumagana

**Gagawin:** I-save ang files, bumalik sa browser, gumawa o mag-edit ng project at pumili ng `Hard`. Ipakita yung value sa admin list at public page. Subukan ding mag-submit nang walang piniling Difficulty para makita ang validation error. Pagkatapos magdagdag ng code, magbabago ang line numbers; gamitin ang **Ctrl+F** para hanapin ang `difficulty`.

**Sasabihin:**

> “Pipili ako ng Hard at ise-save yung project. Tapos susubukan ko ring walang piliin. Dapat tanggapin yung Hard at mag-error kapag blanko, dahil required yung field.”

---

## Ending

**Gagawin:** Ipakita ulit ang public portfolio at yung project na may Difficulty.

**Sasabihin:**

> “Yun yung demo ng portfolio CRUD ko. Naipakita ko yung code flow, pag-add, pagtingin, pag-edit, pag-delete, validation, at yung bagong Difficulty field. Maraming salamat po.”

## Pagkatapos mag-record

I-upload ang video sa Google Drive o YouTube bilang unlisted at tiyaking nabubuksan ang link. Kasama rin sa submission ang documentation PDF, screenshots, at validation test table na may hindi bababa sa anim na test cases at aktuwal na resulta. Boses sa screen recording ang kailangan; optional lang ipakita ang mukha.
