"use client";

import { HistoryUploader } from "@/components/app/history-uploader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info, Upload } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">
            Your Listening History
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload your Spotify data to get a detailed analysis of your entire
            listening history.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Info className="mr-2" />
              How to get your data
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>How to Get Your Spotify Data</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm text-muted-foreground prose prose-invert">
              <p>
                To get a complete analysis of your listening habits, you need to
                request your extended streaming history from Spotify. This is
                part of your rights under GDPR.
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  Go to Spotify's{" "}
                  <a
                    href="https://www.spotify.com/us/account/privacy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    Privacy Settings
                  </a>{" "}
                  page and log in.
                </li>
                <li>
                  Scroll down to the "Download your data" section and request your data. 
                  You will need to request your 'Extended streaming history'.
                </li>
                <li>
                  Spotify will prepare your data and send you an email when it's
                  ready. This can take a few days.
                </li>
                <li>
                  Once you receive the email, download the .zip file and unzip
                  it. Inside the 'MyData' folder, you will find files named{" "}
                  <code className="bg-muted px-1 py-0.5 rounded-sm font-mono">
                    StreamingHistory*.json
                  </code>
                  .
                </li>
                <li>
                  Come back to this page and upload those JSON files using the
                  uploader below.
                </li>
              </ol>
              <Alert>
                <Upload className="h-4 w-4" />
                <AlertTitle>Ready to Upload?</AlertTitle>
                <AlertDescription>
                  Just drag and drop the{" "}
                  <code className="bg-muted px-1 py-0.5 rounded-sm font-mono">
                    StreamingHistory*.json
                  </code>{" "}
                  files into the upload box below.
                </AlertDescription>
              </Alert>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <HistoryUploader />
    </div>
  );
}
