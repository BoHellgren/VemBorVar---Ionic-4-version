import { Http } from "@angular/http";
import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { AlertController } from "@ionic/angular";
@Injectable({
  providedIn: "root"
})

export class MembersService {
  members: Array<{ lgh: string; lmv: string; membername: string }>;
  newmembers: Array<{ lgh: string; lmv: string; membername: string }>;

  constructor(public http: Http, public toastCtrl: ToastController, public alertCtrl: AlertController) {
    console.log("[LoadMembers] constructor called");
  }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: "middle"
    });
    toast.present();
  }

  async presentAlert(msg) {
    const alert = await this.alertCtrl.create({
      header: "Fel vid hämtning av medlemsinformation.",
      subHeader: "Använder lokalt lagrade uppgifter.",
      message: msg,
      buttons: [
        {
          text: "OK",
          handler: () => {
            console.log("[LoadMembers] Alert Confirm Ok");
          }
        }
      ]
    });
    alert.present();
  }

  membersFromStorage(): any {
    const numberOfMembers = Number(
      window.localStorage.getItem("numberOfMembers")
    );
    console.log("[LoadMembers] numberOfMembers in localStorage: ", numberOfMembers);
    this.members = [];
    if (numberOfMembers) {
      for (let i = 0; i < numberOfMembers; i++) {
        this.members.push(
          JSON.parse(window.localStorage.getItem(i.toString()))
        );
      }
    }
    console.log("[LoadMembers] Restored ", numberOfMembers, " members");
    // console.log("[LoadMembers] members: ", this.members);
  }

  membersToStorage(): any {
    const newNumberOfMembers = this.newmembers.length;
    window.localStorage.setItem(
      "numberOfMembers",
      newNumberOfMembers.toString()
    );
    for (let i = 0; i < newNumberOfMembers; i++) {
      window.localStorage.setItem(
        i.toString(),
        JSON.stringify(this.newmembers[i])
      );
    }
    console.log("[LoadMembers] Stored ", newNumberOfMembers, " members");
  }

  loadMembers(): any {
    // First restore members array from storage
    this.membersFromStorage();

    // Get member information from the web site in case it har been updated

    this.newmembers = [];
    const url =
      "http://www.husarvikensstrand.se/f%C3%B6reningen/medlemmar-22749886";
    const proxy = "https://husarvikenproxy.herokuapp.com/";
    //  let proxy = 'https://cors-anywhere.herokuapp.com/';

    console.log("[LoadMembers] proxy+url", proxy + url);
    let errormessage = "";

    this.http.get(proxy + url).subscribe(
      data => {
        // Handle successful http get request

        const pagehtml = data["_body"];
        const tablestart = pagehtml.search("<table");
        const tableend = pagehtml.search("</table");
        const table = pagehtml.substring(tablestart, tableend);

        const rows = table.split("<tr>");

        let i, cells, cell, lmv, lgh, name, previouslgh, previouslmv;

        for (i in rows) {
          if (i > 1) {
            cells = rows[i].split("<td");
            cell = strip(cells[4]);
            if (cell) {
              name = cell;
              cell = strip(cells[2]);
              if (cell !== "") {
                lmv = cell;
                cell = strip(cells[3]);
                lgh = cell;
              }
              if (lmv === '"') {
                lgh = previouslgh;
                lmv = previouslmv;
              } else {
                previouslgh = lgh;
                previouslmv = lmv;
              }
              this.newmembers.push({ lgh: lgh, lmv: lmv, membername: name });
            }
          }
        }
        for (i in rows) {
          if (i > 1) {
            cells = rows[i].split("<td");
            cell = strip(cells[8]);
            if (cell) {
              name = cell;
              cell = strip(cells[6]);
              if (cell !== "") {
                lmv = cell;
                cell = strip(cells[7]);
                lgh = cell;
              }
              if (lmv === '"') {
                lgh = previouslgh;
                lmv = previouslmv;
              } else {
                previouslgh = lgh;
                previouslmv = lmv;
              }
              this.newmembers.push({ lgh: lgh, lmv: lmv, membername: name });
            }
          }
        }
        // console.log("[LoadMembers] Members from web site:", this.newmembers);

        // Store new member data

        this.membersToStorage();

        // Inform the user that there may be new member data

        if (this.members) { // if not the first time the app is used and there were members in storage
          if (
            JSON.stringify(this.members) === JSON.stringify(this.newmembers) // if storage === host
          ) {
            // this.presentToast("Medlemsuppgifterna har stämts av mot hemsidan.");
          } else {
            this.presentToast(
              "Medlemsuppgifterna har uppdaterats \nmed data från hemsidan."
            );
          }
        } else { // there were no members in storage
          this.presentToast(
            "Medlemsuppgifter har hämtats från \nhemsidan och lagrats i appen"
          );
        }
        // Switch to the new version of members
        this.members = this.newmembers;
      },

      err => {
        // Handle errors in http get request

        console.log("[LoadMembers] error!", err);

        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          errormessage = err.error.message;
          console.log("[LoadMembers] Error message:", errormessage);
          this.presentAlert(errormessage);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong
          errormessage =
            "Felkod: " +
            err.status +
            " Feltext: " +
            err.statusText +
            " Felmeddelande: " +
            err["_body"];
          console.log("[LoadMembers] Error message:", errormessage);
          if (err.status === 0) {
            errormessage = "";
          }
          this.presentAlert(errormessage);
        }
      }
    );

    // Function strip. Removes html, returns data in cell

    function strip(cell) {
      return cell.substring(cell.search(">") + 1, cell.search("<")).replace("&nbsp;", " ");
    }
  }
}
